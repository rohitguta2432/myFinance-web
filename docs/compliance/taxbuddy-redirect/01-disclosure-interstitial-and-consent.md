# TaxBuddy redirect — disclosure interstitial + DPDP consent UX

**Jira:** SCRUM-108
**Status:** Draft — pending legal review
**Owner:** Rohit Raj
**Last updated:** 2026-05-20

This spec covers the pre-redirect interstitial users see when they click any TaxBuddy CTA from the MyFinancial dashboard, plus the granular consent capture required if any user data is passed downstream.

---

## 1. Goal

A single interstitial screen that:

1. Discloses TaxBuddy is a third-party service (mandatory under ASCI + Consumer Protection E-Commerce Rules 2020).
2. Discloses MyFinancial earns a referral commission (mandatory material-connection disclosure).
3. Captures granular DPDP-compliant consent **only if** user data is being passed to TaxBuddy. If the redirect is a plain link with no data forwarded, the consent block is hidden and the screen reduces to a disclosure-only acknowledgement.
4. Logs an immutable audit-trail record (see [05-audit-trail-schema.md](./05-audit-trail-schema.md)) before the browser navigates away.

Two redirect modes are supported by the same component:

| Mode | When | Consent required |
|---|---|---|
| **Plain redirect** | User just sees a "Go to TaxBuddy" CTA, no data forwarded | No (acknowledgement only) |
| **Pre-filled redirect** | URL params or API hand-off carries name/email/phone/PAN/income bucket | Yes (granular checkbox per field category) |

Default to plain redirect unless there is a measured uplift case for pre-fill. **Architectural decision, not accidental** — see open question Q1.

---

## 2. Interstitial copy

### 2.1 Plain-redirect mode (no data forwarded)

> **You're leaving MyFinancial.**
>
> We're sending you to **TaxBuddy** for tax filing. TaxBuddy is an independent third-party service — they handle the filing, their own Chartered Accountants sign returns, and their fees, refunds, and customer support are governed by TaxBuddy's own terms.
>
> MyFinancial earns a referral fee when you file through this link. This does not change what you pay TaxBuddy.
>
> [ Continue to TaxBuddy → ]   [ Cancel ]
>
> <sub>By continuing you acknowledge that MyFinancial is not responsible for TaxBuddy's services. See our [Terms of Service](https://myfinancial.in/terms#third-party) and [Privacy Policy](https://myfinancial.in/privacy).</sub>

### 2.2 Pre-filled-redirect mode (data forwarded)

Same top block as 2.1, then:

> **What we'll share with TaxBuddy**
>
> To save you re-typing, we'll pass the following to TaxBuddy. We share only what's needed for ITR filing.
>
> - [✓] **Name and email** — so TaxBuddy can create your account *(required to pre-fill)*
> - [☐] **Phone number** — for filing OTP and CA contact
> - [☐] **PAN** — required by Income Tax Department to file a return
> - [☐] **Income bracket** *(approximate, not exact figures)* — so TaxBuddy picks the right ITR form
>
> You can uncheck any optional field; you'll just need to re-enter it on TaxBuddy. You can withdraw consent later from **Settings → Privacy → Connected services**.
>
> [ I consent and continue → ]  *(button disabled until at least the required boxes are ticked)*  [ Cancel ]
>
> <sub>Consent is recorded against Privacy Notice **v{notice_version}** at {timestamp}. Read the [Privacy Policy](https://myfinancial.in/privacy#taxbuddy) for full disclosure on retention, breach notification, and your DPDP rights.</sub>

### 2.3 Language

- English by default.
- Hindi translation required before launch (DPDP requires plain-language notice in English + at least one Indian language for general audiences; Hindi is the safe default).
- Future: per-user-locale rendering (Malayalam, Tamil, Bengali, Marathi) once the localisation pipeline lands.

---

## 3. Consent UX rules (DPDP Act 2023)

These are non-negotiable for pre-filled mode:

| Rule | How it's met |
|---|---|
| **Specific & granular** | One checkbox per data category, not a single "I agree to everything" toggle |
| **Affirmative action** | All boxes default to **unchecked** except the strict minimum required by TaxBuddy's API (currently name + email per their integration spec). Required boxes are pre-ticked but **clearly labelled** as required — no dark-pattern pre-tick of optional fields |
| **Not bundled with ToS** | The TaxBuddy consent is a separate screen; it cannot be combined with signup, login, or general ToS acceptance |
| **Identifies the recipient** | "TaxBuddy" named explicitly (not "our partners") |
| **Purpose-limited** | Each field labelled with the *single* purpose it'll be used for (account creation, filing OTP, etc.). No "for marketing" or "for other services" tacked on |
| **Plain language** | No legalese in the checkbox labels. Detailed legal grounds live in the linked Privacy Policy |
| **Withdrawable** | A persistent revocation surface exists at Settings → Privacy → Connected services |
| **Logged** | Each consent event written to the audit trail (see [05-audit-trail-schema.md](./05-audit-trail-schema.md)) before the redirect fires |
| **Reversible client-side state** | If the user toggles a checkbox, the audit log records only the *final* committed state at click-time, not intermediate toggles |

---

## 4. Component spec (frontend)

### 4.1 Trigger points

Any CTA on the dashboard that initiates a TaxBuddy redirect must route through this component. Direct `<a href>` to TaxBuddy is **not allowed**.

Suggested integration:

```tsx
// app/components/TaxBuddyRedirect.tsx
<TaxBuddyRedirect
  mode="prefilled"           // or "plain"
  sourceCTA="dashboard-itr-card"
  prefillFields={['name', 'email', 'phone', 'pan', 'incomeBracket']}
  onConsent={(payload) => logConsent(payload).then(() => navigate(taxBuddyUrl(payload)))}
  onCancel={() => closeModal()}
/>
```

### 4.2 Layout

- **Modal**, not a full page — keeps return-to-MyFinancial obvious.
- 480px wide on desktop, full-width sheet on mobile (`<640px`).
- Heading: 20px / semibold. Body: 16px / regular. Sublabels: 13px.
- "Continue to TaxBuddy" is the primary CTA; "Cancel" is a tertiary text button — never give them equal weight (visual asymmetry reinforces this is a deliberate decision, not a casual click).
- Show the TaxBuddy logo next to the title with the line "Powered by TaxBuddy" *only if* the contract grants logo-use licence (see [04-contract-and-dpa-checklist.md](./04-contract-and-dpa-checklist.md)).

### 4.3 Accessibility

- All checkboxes operable by keyboard (Space toggles, Enter submits).
- ARIA-live region announces consent state changes to screen readers.
- Focus trapped inside the modal; Esc closes it (and records `consent_status: "cancelled"` in the audit trail).
- Colour contrast ≥ 4.5:1 for body text; the "Continue" button must not rely on colour alone to indicate enabled state.

### 4.4 States

| State | Behaviour |
|---|---|
| Required field unchecked | Continue button disabled, sublabel "Tick the required fields to continue" appears under the button |
| All required ticked | Continue enabled, becomes primary green |
| Continue clicked | Button disabled with spinner, audit-log POST fires, navigation only after 200 OK from logging endpoint |
| Logging endpoint fails | Show retry banner; **do not** redirect — fall back to user confirmation that they want to proceed without consent capture (which logs a `consent_status: "failed_to_record"` server-side anomaly) |
| Cancel clicked | Modal closes, log `consent_status: "cancelled"` with no PII attached |

---

## 5. Notice versioning

- Privacy notice content is keyed by `notice_version` (e.g. `2026-05-20.v1`).
- Every consent record stores the exact `notice_version` shown.
- When ToS or Privacy Policy changes materially, bump the version. Old consents remain valid for past actions but new redirects require fresh consent against the new version.

---

## 6. Sector-specific overlay

If MyFinancial holds an SEBI RIA or RA registration (TBD — see Q3):

- The interstitial must avoid any language that implies MyFinancial provides "tax advice." The current copy is safe — "tax filing" framed entirely as TaxBuddy's service.
- The ICAI angle is already covered — TaxBuddy's own CAs sign filings; MyFinancial copy does not imply otherwise.

No payment flow runs through MyFinancial → no RBI payment-aggregator concern. Fees are collected by TaxBuddy directly. This is locked in by the architecture and **must not change** without a new compliance review.

---

## 7. Open questions for legal

1. **Q1.** Plain redirect vs pre-filled — is there a contractual or commercial reason to default to pre-fill? If not, we ship plain-only in v1 and revisit.
2. **Q2.** Is the commission percentage subject to NDA? If yes, the disclosure stays generic ("we earn a referral fee"); if not, ASCI guidance prefers naming the amount or range.
3. **Q3.** Does MyFinancial Pvt Ltd hold any SEBI RIA / RA / IA registration today? If yes, RA Regulations 2014 advisory-conflict rules apply and we may need an additional disclosure layer.
4. **Q4.** Are we offering this to users who signed up before this consent screen existed? If yes, we need a one-time "existing user" prompt — not a silent enable.
5. **Q5.** Retention — how long does TaxBuddy hold the data shared via this redirect, and how is deletion-on-withdrawal propagated to them? Captured in [04-contract-and-dpa-checklist.md](./04-contract-and-dpa-checklist.md), but the answer affects the interstitial sublabel.

---

## 8. Reviewers needed before merge

- [ ] Legal (Nithin / external counsel) — ASCI + DPDP + IT Act sign-off on copy
- [ ] Design — modal layout, mobile sheet, accessibility audit
- [ ] Frontend lead — component API + audit-log integration
- [ ] Backend — confirm audit-log endpoint contract (see [05-audit-trail-schema.md](./05-audit-trail-schema.md))
- [ ] Hindi translator — clean Hindi version of all copy

---

## 9. Related specs

- [02-tos-third-party-clause.md](./02-tos-third-party-clause.md) — ToS update referenced from the sublabel link
- [03-privacy-policy-and-consent.md](./03-privacy-policy-and-consent.md) — Privacy Policy section the consent links to
- [04-contract-and-dpa-checklist.md](./04-contract-and-dpa-checklist.md) — TaxBuddy contractual / DPA dependencies
- [05-audit-trail-schema.md](./05-audit-trail-schema.md) — schema for the consent log this UI writes to
