# TaxBuddy redirect — audit-trail logging schema

**Jira:** SCRUM-108
**Status:** Draft — ready for backend implementation review
**Owner:** Rohit Raj
**Last updated:** 2026-05-20

The audit trail is the compliance backbone of the TaxBuddy redirect. Every consent, modification, withdrawal, and data-sharing event is logged immutably so MyFinancial can answer any DPDP complaint, regulator inquiry, or user access request with concrete evidence. This document specifies the storage schema, write API, retention policy, and access patterns.

---

## 1. What goes into the log

Every event that touches consent state or shares user data downstream:

| Event type | When fired |
|---|---|
| `consent_granted` | User clicks "I consent and continue" on the interstitial |
| `consent_cancelled` | User closes the interstitial or clicks "Cancel" |
| `consent_modified` | User updates which fields they share, from Settings → Connected services |
| `consent_revoked` | User clicks "Disconnect" |
| `data_shared` | Data is actually transmitted to TaxBuddy (separate event so we can prove what was sent, not just what was consented to) |
| `consent_withdrawal_propagated` | TaxBuddy webhook acknowledged the revocation |
| `consent_withdrawal_failed` | TaxBuddy webhook didn't respond or rejected — needs manual reconciliation |

---

## 2. Storage choice

- **Primary store:** an append-only table `consent_audit_log` in the existing operational Postgres.
- **Secondary (immutable) store:** weekly export of the table to S3 with object-lock in compliance mode for 7 years. This is the legal-defence copy — Postgres rows could be tampered with by an insider; S3 object-lock cannot.
- **Schema migrations** affecting this table require a four-eyes review (engineering lead + privacy lead) — no exceptions.

---

## 3. `consent_audit_log` schema

```sql
CREATE TABLE consent_audit_log (
    id                        BIGSERIAL PRIMARY KEY,
    event_id                  UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    occurred_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    recorded_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id                   BIGINT NOT NULL REFERENCES users(id),
    session_id                UUID,                              -- nullable; from auth session
    third_party_service_id    TEXT NOT NULL,                     -- 'taxbuddy', future: 'cleartax', 'quicko'
    event_type                TEXT NOT NULL,                     -- see §1
    consent_status            TEXT NOT NULL,                     -- 'granted','cancelled','modified','revoked','propagated','propagation_failed'
    data_categories           JSONB NOT NULL,                    -- array of strings: ['name','email','phone','pan','income_bracket']
    required_categories       JSONB NOT NULL,                    -- subset of data_categories that were required (not optional)
    notice_version            TEXT NOT NULL,                     -- e.g. '2026-05-20.v1'
    privacy_policy_version    TEXT NOT NULL,                     -- e.g. 'pp-2026-05-20'
    tos_version               TEXT NOT NULL,                     -- e.g. 'tos-2026-05-20'
    source_cta                TEXT NOT NULL,                     -- 'dashboard-itr-card', 'fy-end-banner', etc.
    redirect_mode             TEXT NOT NULL,                     -- 'plain' | 'prefilled'
    user_locale               TEXT NOT NULL,                     -- 'en-IN','hi-IN','ml-IN', etc.
    ip_hash                   TEXT NOT NULL,                     -- SHA-256(ip + per-day salt); see §6
    user_agent_hash           TEXT,                              -- SHA-256 of UA; raw UA in cold storage only
    request_id                TEXT,                              -- correlation with API gateway logs
    notes                     TEXT,                              -- free-text reason for unusual events (manual reconciliation, edge cases)
    payload_hash              TEXT NOT NULL,                     -- SHA-256 of the canonical JSON of this row (less id, recorded_at) — for tamper detection
    CHECK (event_type IN (
        'consent_granted','consent_cancelled','consent_modified','consent_revoked',
        'data_shared','consent_withdrawal_propagated','consent_withdrawal_failed'
    )),
    CHECK (consent_status IN (
        'granted','cancelled','modified','revoked','propagated','propagation_failed','failed_to_record'
    ))
);

CREATE INDEX consent_audit_log_user_idx     ON consent_audit_log (user_id, occurred_at DESC);
CREATE INDEX consent_audit_log_service_idx  ON consent_audit_log (third_party_service_id, occurred_at DESC);
CREATE INDEX consent_audit_log_event_idx    ON consent_audit_log (event_type, occurred_at DESC);

-- enforce append-only at the DB level
REVOKE UPDATE, DELETE ON consent_audit_log FROM PUBLIC;
REVOKE UPDATE, DELETE ON consent_audit_log FROM application_role;
GRANT INSERT, SELECT ON consent_audit_log TO application_role;
```

### Why the fields look like this

- `event_id` is the externally visible identifier — `id` is internal and may not be exposed in user-facing access requests.
- `occurred_at` and `recorded_at` are separated so we can detect (and explain) clock skew between client and server.
- `notice_version`, `privacy_policy_version`, and `tos_version` are stored separately because they may not all change together — a ToS-only edit shouldn't invalidate the consent if Privacy Policy was unchanged.
- `data_categories` is a JSONB array, not a comma-separated string, so it's queryable: `WHERE data_categories ? 'pan'` finds every PAN-share event.
- `ip_hash` not raw IP — IP is personal data under DPDP; storing the hash with a daily salt lets us prove the same user device hit consent twice in a day without keeping the IP itself in the operational store. Raw IP can be reconstructed for a specific incident from API gateway logs (90-day retention) if needed.
- `payload_hash` is the tamper-evidence anchor. Any insider who edits a row will break the hash — the weekly S3 export catches this on the next replay.

---

## 4. Write API (internal service)

### Endpoint

```
POST /internal/v1/consent-audit-log
Authorization: <service-to-service JWT>
Content-Type: application/json
```

### Request body

```json
{
  "user_id": 884521,
  "session_id": "8b8f991e-e3bb-4362-a80d-959520c8c052",
  "third_party_service_id": "taxbuddy",
  "event_type": "consent_granted",
  "consent_status": "granted",
  "data_categories": ["name", "email", "phone"],
  "required_categories": ["name", "email"],
  "notice_version": "2026-05-20.v1",
  "privacy_policy_version": "pp-2026-05-20",
  "tos_version": "tos-2026-05-20",
  "source_cta": "dashboard-itr-card",
  "redirect_mode": "prefilled",
  "user_locale": "en-IN",
  "client_occurred_at": "2026-05-20T11:43:02.812+05:30"
}
```

### Server-side derivations

- `occurred_at` = `client_occurred_at` if within ±5 minutes of server time, else server `now()` with a `notes` entry "client clock skew >5min".
- `ip_hash` = SHA-256 over the request IP + a per-day rotating salt held in KMS.
- `user_agent_hash` = SHA-256 over the `User-Agent` header.
- `request_id` from API gateway header.
- `payload_hash` = SHA-256 over the canonical JSON of the row minus `id`, `recorded_at`, and `payload_hash` itself.

### Response

```json
{
  "event_id": "f6e8a3b2-8c91-4f3a-b1d7-9c1a4f5e8d22",
  "recorded_at": "2026-05-20T11:43:02.913Z"
}
```

The interstitial does not redirect until it has received a `200 OK` from this endpoint. If the call fails, the user sees a retry banner — never a silent redirect without log.

---

## 5. Read patterns

### User-facing — "Download my consent log"

Exposes only the columns relevant to the user (excludes `payload_hash`, `ip_hash`, `request_id`, `notes`):

```sql
SELECT event_id, occurred_at, third_party_service_id, event_type, consent_status,
       data_categories, required_categories, notice_version, privacy_policy_version,
       tos_version, source_cta, redirect_mode, user_locale
  FROM consent_audit_log
 WHERE user_id = $1
 ORDER BY occurred_at DESC;
```

Returned as JSON download via the **Settings → Privacy → Connected services → View consent log → Download** button.

### Compliance team — full row export

Internal-only, gated behind a "compliance" RBAC role with audit logging of every read.

### Regulator / DPB inquiry

Compliance team runs the full export for the affected `user_id` and the date range, attaches the S3-archived snapshot of the same period as tamper-evidence, ships to regulator with privacy-officer cover note.

---

## 6. IP-hash salt rotation

- Salt rotates daily at 00:00 IST, held in AWS KMS with `kms:Decrypt` granted only to the audit-log writer service role.
- Old salts retained for 90 days so historical IPs can still be reconstructed for an in-window incident; after 90 days, only the salted hash remains and re-identification is computationally infeasible.
- This trade-off — investigative reach vs. retention minimisation — should be re-evaluated by the privacy officer annually.

---

## 7. Retention

| Data | Retention | Where |
|---|---|---|
| `consent_audit_log` rows in Postgres | 7 years | Operational store |
| Weekly snapshots in S3 (object-locked) | 7 years | Cold legal-defence store |
| API gateway raw logs (with IPs) | 90 days | Operational |
| Per-day IP salts in KMS | 90 days | KMS audit log |

7 years aligns with the Income-tax Act §149 reassessment window (now 5 years for most cases, 10 years for very large escapements) and exceeds the DPDP rules' expected retention window for consent records. Re-evaluate when DPDP rules are finalised.

---

## 8. Monitoring & alerts

- **Alert (PagerDuty, high):** `consent_withdrawal_failed` count > 5 in 1 hour → likely TaxBuddy webhook is down → privacy team manually reconciles within DPDP-prescribed window.
- **Alert (PagerDuty, high):** any write to `consent_audit_log` via `UPDATE` or `DELETE` → DB role permission breach, page security on-call immediately.
- **Alert (Slack, medium):** consent-grant rate drops >50% week-over-week → interstitial may be broken or copy may be off; UX investigates.
- **Daily report:** count of each `event_type` for the trailing 24h, week, and month → Slack #compliance.
- **Weekly job:** verify each row's `payload_hash` matches its current contents; any mismatch pages security.

---

## 9. Privacy and security review checklist

- [ ] No raw PII in `consent_audit_log` — only categories shared, never values.
- [ ] No raw IP — `ip_hash` only, with rotating salt.
- [ ] Insert-only DB role enforced at the DB level, not just app level.
- [ ] S3 bucket has object-lock in compliance mode (not governance — compliance prevents even root from deleting before the retention period).
- [ ] KMS keys for the IP salt are in a separate AWS account from the application database (defence in depth).
- [ ] Quarterly access review of who can read this table.
- [ ] Annual restoration drill — restore a random week's S3 snapshot and verify `payload_hash` chain.

---

## 10. Open questions

1. Is there an existing audit-log table in MyFinancial for other purposes? If yes, should this extend it or stay separate? **Recommendation:** stay separate — mixing consent events with other audit events makes regulator hand-offs noisy.
2. Does the API gateway already attach a `request_id` header? If not, add one before this ships.
3. Confirm KMS is already in use for other secrets at MyFinancial. If not, this introduces it — that's fine, but adds a small ops dependency.
4. Should the user be able to delete their own consent log? **Recommendation:** no — the log is the evidence MyFinancial relies on to defend any complaint *from* the user. Deletion-by-user makes the defence collapse. Document this clearly in the Privacy Policy and the Settings UI.

---

## 11. Reviewers needed before merge

- [ ] Backend lead — schema, write API, RBAC
- [ ] Security / Infra — KMS keys, S3 object-lock, role separation
- [ ] Privacy lead — DPDP fit, retention windows
- [ ] Frontend lead — interstitial's blocking behaviour on log-write failure
- [ ] Compliance / legal — sufficiency of fields for likely regulator asks
