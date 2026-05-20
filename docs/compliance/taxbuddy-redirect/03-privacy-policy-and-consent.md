# TaxBuddy redirect — Privacy Policy update + Connected Services UX

**Jira:** SCRUM-108
**Status:** Draft — pending legal review
**Owner:** Rohit Raj
**Last updated:** 2026-05-20

The Privacy Policy must be updated *before* the TaxBuddy redirect ships in pre-filled mode. This document contains the new policy section text, the "Connected services" settings UX where users manage and revoke consent, and the DPDP Act 2023 compliance mapping.

---

## 1. Privacy Policy section text

Insert as a new sub-section under the existing **"Sharing of your personal data"** heading. Anchor: `#third-party-sharing`.

### Sharing with third-party services (TaxBuddy and others)

**1. What this section is about.** MyFinancial connects with select third-party services so you can complete actions started on our platform without re-entering your details. The current connected service is **TaxBuddy** (operated by Finbingo Wealth Tech Private Limited) for income-tax return filing. We will update this section before adding any new third-party recipient.

**2. The data we may share.** Only the minimum personal data needed for the connected service to do its job. For TaxBuddy, this is limited to:

| Data category | Why it's needed | Required or optional |
|---|---|---|
| Name | TaxBuddy account creation | Required |
| Email address | TaxBuddy account creation, e-acknowledgement delivery | Required |
| Phone number | Filing OTP, CA contact | Optional |
| PAN (Permanent Account Number) | Mandated by the Income Tax Department to file a return | Optional, but TaxBuddy will ask you for it directly if not pre-filled |
| Income bracket (approximate range, not exact figures) | Select the right ITR form | Optional |

We do not share your investment holdings, bank balances, transactions, mutual fund portfolio, or any other financial data with TaxBuddy. The data sharing happens at the moment you click "I consent and continue" on the TaxBuddy redirect interstitial, and not before.

**3. Lawful basis.** Under the Digital Personal Data Protection Act, 2023 ("DPDP Act"), the lawful basis for this sharing is your **specific, informed, free, and unambiguous consent**, captured at the point of redirect. You may withdraw consent at any time (see Section 6 below). Withdrawal is as easy as giving consent was.

**4. Notice version control.** Each consent you give is recorded against the exact version of this Privacy Policy in force at that moment. If we materially change what data is shared, with whom, or for what purpose, we will ask for fresh consent — old consents do not auto-roll over.

**5. What TaxBuddy does with your data after we share it.** Once data reaches TaxBuddy, it is governed by TaxBuddy's own Privacy Policy and the Data Processing Agreement between MyFinancial and TaxBuddy. Under that agreement, TaxBuddy is contractually required to:

- Use the data only for the purpose you consented to (ITR filing and directly related communications);
- Apply industry-standard security controls including encryption in transit and at rest;
- Notify MyFinancial within 24 hours of becoming aware of any personal-data breach affecting your data, so we can in turn notify you and the Data Protection Board of India within the timelines DPDP rules prescribe;
- Delete or anonymise your data on instruction from MyFinancial when you withdraw consent, subject only to records they are legally required to retain (such as filing acknowledgements under the Income-tax Act, which they may keep for the statutory retention window).

The Data Processing Agreement is summarised at [Privacy → Data sharing partners](./connected-services.md) and the redacted full agreement is available on request to the Grievance Officer.

**6. Your rights and how to exercise them.** Under the DPDP Act you have the right to:

- **Access** — request a copy of the personal data MyFinancial holds about you, including what has been shared with TaxBuddy.
- **Correction** — ask us to correct inaccurate data, and to forward the correction to TaxBuddy if applicable.
- **Erasure** — ask us to delete data we hold and to instruct TaxBuddy to do the same (subject to their statutory retention obligations under the Income-tax Act).
- **Withdraw consent** — at any time, with no cost or penalty. Withdrawal stops future sharing but does not retroactively erase what was already shared and processed lawfully before the withdrawal.
- **Grievance redressal** — first contact our Grievance Officer (details in Section 12 of this Privacy Policy). If unresolved within 30 days, you may approach the Data Protection Board of India once it is constituted under the DPDP Act.
- **Nomination** — nominate another individual to exercise your rights in the event of your death or incapacity.

**7. Children.** If you are under 18, MyFinancial will not share your data with TaxBuddy or any other third-party service. The redirect interstitial will refuse the consent action for accounts flagged as under-18.

**8. International transfers.** TaxBuddy processes data within India. No cross-border transfer of personal data occurs under this connection. If TaxBuddy changes hosting jurisdiction, we will update this section and seek fresh consent.

**9. Material connection / commercial relationship.** MyFinancial may receive a referral fee when you file through TaxBuddy via this connection. This is disclosed in the redirect interstitial and in our [Terms of Service](./terms.md#third-party). This commercial relationship does not influence what data we share, how we share it, or your rights.

---

## 2. Connected Services settings UX

A new sub-page under **Settings → Privacy → Connected services** is the user-facing surface for managing third-party consents. The interstitial sublabel and the Privacy Policy both link here.

### 2.1 Page layout

- Heading: **Connected services**
- Sub-heading: "Services you've connected from your MyFinancial account. Disconnect anytime."

### 2.2 Per-service row (TaxBuddy as the live example)

| Field | Value (example) |
|---|---|
| Service logo + name | TaxBuddy (operated by Finbingo Wealth Tech Pvt Ltd) |
| Connected since | 2026-05-12 (date of first consent) |
| Data shared | Name, Email, Phone (icons; tap for breakdown) |
| Privacy-notice version at time of consent | v2026-05-20.v1 |
| Last sharing event | 2026-05-19 11:43 IST — ITR filing redirect |
| Status | Active / Revoked / Expired |
| **Actions** | [ View consent log ] [ Update what's shared ] [ Disconnect ] |

### 2.3 Disconnect flow

- Clicking **Disconnect** opens a modal:
  > "Disconnecting will stop MyFinancial from sharing any further data with TaxBuddy. Data TaxBuddy already received will remain with them, subject to their privacy policy and any legal retention requirements (such as Income-tax Act filing records). You can reconnect anytime. Continue?"
  > [ Yes, disconnect ]   [ Keep connected ]
- On confirmation, writes a `consent_revoked` event to the audit log (see [05-audit-trail-schema.md](./05-audit-trail-schema.md)) and POSTs a withdrawal notice to TaxBuddy's API per the DPA.
- UI immediately reflects "Revoked at {timestamp}".

### 2.4 View consent log

Read-only timeline of every consent event for this service: granted, modified, revoked. Each entry shows timestamp, IP (last octet masked), data categories at that point, and privacy-notice version. Hand to user as JSON via "Download log" button (DPDP access right §11(1)).

---

## 3. DPDP Act 2023 compliance map

For internal traceability — each DPDP obligation mapped to where it's satisfied in this design.

| DPDP requirement | Section / artifact |
|---|---|
| §4: Consent must be free, specific, informed, unconditional, unambiguous, with clear affirmative action | [01-disclosure-interstitial-and-consent.md §3](./01-disclosure-interstitial-and-consent.md) |
| §5(1): Notice accompanying or preceding consent in plain language | Interstitial copy + Privacy Policy update (above) |
| §5(3): Notice in English + an Indian language listed in 8th Schedule | Hindi version mandatory before launch |
| §6(1): Right to withdraw consent as easily as given | Settings → Privacy → Connected services → Disconnect (one click) |
| §6(4): Data Fiduciary to cease processing on withdrawal | Audit-log + TaxBuddy DPA-mandated webhook on disconnect |
| §8(1): Reasonable security safeguards | TLS in transit, encryption at rest, AWS KMS-managed keys (myfinancial-ui current standard) |
| §8(6): Breach notification to DPB and affected Data Principals | DPA Section X requires TaxBuddy to notify MyFinancial within 24 hours; MyFinancial then notifies DPB and users on the prescribed timeline |
| §9: Processing of children's personal data — verifiable consent of parent or guardian for under-18 | Interstitial refuses consent for under-18 flagged accounts (see §7 of policy text above) |
| §11: Right to access information about personal data | "View consent log" + general Privacy access request flow |
| §12: Right to correction & erasure | General privacy rights flow; this section cross-references it |
| §13: Right of grievance redressal | Grievance Officer contact in Privacy Policy §12 |
| §17: Significant Data Fiduciary obligations | TBD — MyFinancial may not yet meet the thresholds; reassess at scale |

---

## 4. Implementation order

1. Privacy Policy section text approved by legal → published as a versioned draft (not yet live).
2. Connected Services UI built and tested with a feature flag (`taxbuddy.connectedServices.enabled = false`).
3. ToS clause (see [02-tos-third-party-clause.md](./02-tos-third-party-clause.md)) published in same release.
4. Audit-log endpoint shipped and verified end-to-end (see [05-audit-trail-schema.md](./05-audit-trail-schema.md)).
5. Interstitial component shipped behind a feature flag.
6. **Same release** flips all flags atomically — Privacy Policy goes live, interstitial fires, log records. Never half-roll: ToS without log, or interstitial without Privacy Policy text, is a DPDP exposure.

---

## 5. Open questions

1. Does MyFinancial currently have a published Privacy Policy version-control scheme? If not, introduce one — DPDP audit defence depends on being able to show the exact text a given user consented against.
2. Is there an existing "Settings → Privacy" surface, or does this page need to be created? Affects scope of frontend work.
3. Confirm TaxBuddy supports a programmatic consent-revocation webhook. If not, the DPA must require it as a precondition to launch — without it, "withdraw consent as easily as given" is not satisfied.
4. Under-18 detection — does the current signup flow capture date-of-birth reliably? If not, §9 compliance has a gap.

---

## 6. Reviewers needed before merge

- [ ] Legal (external counsel or Nithin)
- [ ] Privacy Officer (designate one if no one currently holds the title — DPDP §10(1)(b) requires a Data Protection Officer for Significant Data Fiduciaries; even if MyFinancial is not yet classified as one, designating a privacy lead is best practice)
- [ ] Design — Connected services page mockup
- [ ] Backend — disconnect webhook + consent log query API
- [ ] Hindi translator — Hindi version of the policy section text
