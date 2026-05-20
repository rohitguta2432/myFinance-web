# TaxBuddy referral agreement + Data Processing Agreement — negotiation checklist

**Jira:** SCRUM-108
**Status:** Pre-negotiation checklist — not signed
**Owner:** Rohit Raj
**Last updated:** 2026-05-20

This is the internal checklist MyFinancial must walk into the TaxBuddy negotiation with. It covers the commercial referral agreement and the Data Processing Agreement (DPA) that DPDP Act 2023 requires before any personal data is shared. **Nothing in this document is a draft contract; it is the scoping list to take to counsel.**

---

## A. Referral / affiliate agreement — must-haves

### A.1 Parties

- Confirm legal entity of TaxBuddy: **Finbingo Wealth Tech Private Limited** (CIN to be verified at signing — Finbingo is the trading name; the registered name on incorporation should be cross-checked at the MCA portal at signature).
- Confirm MyFinancial signing entity: **{TBD — Pvt Ltd legal name}**. See ToS Q2 — the entity name must match across the contract, ToS, and Privacy Policy.

### A.2 Commercial terms

- **Pricing model**. Options to lock down with TaxBuddy:
  - Per-click (paid for each verified outbound click — easy to game, weakest model)
  - Per-lead (paid for each user who signs up on TaxBuddy via the link)
  - Per-filing (paid only when a return is filed and TaxBuddy invoices the user) — preferred for MyFinancial since it aligns incentives
  - Hybrid (small lead bounty + larger per-filing share)
- **Rate**. Negotiate based on category benchmarks; record the agreed % or ₹ amount.
- **Currency, tax treatment, and invoicing.** All amounts in INR. Referral fee is a taxable supply under SAC 9983 / 9997 — MyFinancial raises tax invoices, charges 18% GST. Confirm TaxBuddy is GST-registered and can claim input credit; misclassification by TaxBuddy is not MyFinancial's problem if invoices are correct.
- **Payment terms.** Net-30 after invoice, late-payment interest at 1.5% per month after 45 days. Quarterly reconciliation cycle.
- **Reporting cadence.** TaxBuddy provides a daily click + signup feed and a monthly filing-attribution report.
- **Audit rights.** MyFinancial may audit attribution reports once per financial year via an independent CA, at MyFinancial's expense unless a >5% discrepancy is found in which case TaxBuddy bears the audit cost.

### A.3 Scope of redirect

- Explicit scope of where TaxBuddy links may appear (dashboard ITR card, tax-saving education content, end-of-financial-year banner, etc.). Lock the list, require written approval for new placements.
- **No reverse traffic** — TaxBuddy cannot link back to MyFinancial in a way that confuses users into thinking they remain inside MyFinancial.
- **No competitive lock-in by default** — MyFinancial must remain free to add ClearTax, Quicko, Cleartax, or any other tax-filing partner. Any exclusivity ask from TaxBuddy is a hard escalation to the founder.

### A.4 Indemnity & liability cap

- **TaxBuddy indemnifies MyFinancial** for:
  - Service deficiency claims (mis-filing, late filing, refund disputes) made by MyFinancial users
  - Data-breach claims for data TaxBuddy receives
  - IP infringement claims arising from TaxBuddy's service
  - Regulatory penalties imposed because TaxBuddy violated tax law, advisory law, or DPDP
- **MyFinancial indemnifies TaxBuddy** for:
  - Misrepresentation of TaxBuddy's service in MyFinancial's own marketing copy
  - Unauthorised use of TaxBuddy's brand
- **Liability cap**. Aggregate liability of each party capped at the higher of (a) ₹50,00,000 or (b) the referral fees paid in the preceding 12 months. **No cap** on data-breach indemnity (DPDP §33 penalties go up to ₹250 crore — capping would be commercially unviable and arguably unenforceable).

### A.5 Brand & logo licence

- TaxBuddy grants MyFinancial a non-exclusive, royalty-free, India-territory licence to use the TaxBuddy name and logo solely to identify TaxBuddy on the MyFinancial interface and in promotional copy approved by TaxBuddy.
- Reciprocal licence from MyFinancial to TaxBuddy for the same purposes, if applicable.
- All goodwill in the TaxBuddy mark accrues to TaxBuddy; all goodwill in the MyFinancial mark accrues to MyFinancial.
- Licence terminates immediately on termination of the referral agreement.

### A.6 Term, termination & data-handover

- Initial term: 12 months, auto-renew for 12-month periods unless either party gives 60 days' written notice.
- Termination for convenience: either party with 60 days' notice.
- Termination for cause: immediate, for material breach (including data breach), insolvency, regulatory action.
- **On termination:**
  - MyFinancial removes all TaxBuddy-branded surfaces and links within 7 calendar days.
  - TaxBuddy continues to serve users who have active filings in progress, on the existing fee terms, until completion.
  - TaxBuddy deletes or anonymises all personal data received from MyFinancial-referred users within 90 days, except where statutory retention (Income-tax Act) requires longer.
  - Audit of final referral fees within 30 days; remaining payments settled within 30 days of the audit.

### A.7 Governing law & disputes

- Governing law: Republic of India.
- Jurisdiction: courts at **{TBD — Bengaluru or Mumbai, MyFinancial's home jurisdiction}** to the exclusion of all others.
- Arbitration optional for disputes >₹25 lakh — single arbitrator under Arbitration & Conciliation Act, 1996.

### A.8 Service-level expectations

- TaxBuddy uptime target: ≥99.5% measured monthly, excluding planned maintenance windows.
- Outage longer than 2 hours during peak ITR season (July 1 – July 31) entitles MyFinancial to remove the link without breaching the agreement until service is restored.

---

## B. Data Processing Agreement (DPA) — must-haves

The DPA is a **separate annexure** to the referral agreement (do not bury inside the main contract — DPDP audit teams expect a standalone document).

### B.1 Roles

- MyFinancial is a **Data Fiduciary** under DPDP §2(i) for the data MyFinancial collects directly from users.
- TaxBuddy is, depending on how it processes the data:
  - A **Data Fiduciary** when it determines purposes for ITR filing (most likely);
  - A **Data Processor** for any acts done strictly on MyFinancial's instructions (rare in this flow).
- The DPA names both roles and the data flows where each applies. When in doubt, assume Fiduciary-to-Fiduciary sharing — the obligations are stricter and therefore safer to default to.

### B.2 Data inventory

Annexure 1 of the DPA lists, exactly:

| Field | Purpose | Lawful basis | Retention with TaxBuddy |
|---|---|---|---|
| Name | Account creation | Consent | Until consent withdrawn or 7 yrs post-filing (IT Act) |
| Email | Account creation, e-acknowledgement | Consent | Same |
| Phone | Filing OTP, CA contact | Consent | Same |
| PAN | Statutory (Income-tax Act) | Consent + legal obligation | 7 years post-filing |
| Income bracket | ITR form selection | Consent | Until consent withdrawn |

No other field may be shared without amending Annexure 1 first.

### B.3 Security safeguards (DPDP §8(5))

TaxBuddy must, at minimum:

- TLS 1.2+ in transit, AES-256 at rest;
- Role-based access control with quarterly access reviews;
- Encryption-key custody separate from the data store (HSM or KMS-managed);
- Vulnerability scanning monthly, penetration testing annually, results summary shared with MyFinancial on request;
- ISO 27001 or SOC 2 Type II certification within 12 months of signing (target, not gate);
- Sub-processor list disclosed and updated; MyFinancial has a right to object to new sub-processors within 30 days.

### B.4 Breach notification (DPDP §8(6))

- TaxBuddy notifies MyFinancial within **24 hours** of becoming aware of any personal-data breach affecting data received from MyFinancial.
- Notification includes: nature of breach, categories and approximate number of Data Principals affected, likely consequences, measures taken or proposed.
- MyFinancial then notifies the Data Protection Board of India and affected Data Principals within the timeline prescribed by DPDP rules (currently 72 hours from awareness, subject to final rule notification).
- TaxBuddy cannot unilaterally communicate with affected Data Principals without prior coordination with MyFinancial — avoids messaging conflicts.

### B.5 Consent withdrawal propagation

- MyFinancial sends a consent-withdrawal notice to TaxBuddy's documented webhook endpoint **within 24 hours** of the user clicking "Disconnect."
- TaxBuddy acknowledges receipt within 24 hours and ceases processing within 7 days, except for data they are legally required to retain (filing records).
- If TaxBuddy lacks a programmatic consent-withdrawal webhook, this is a **gating issue** — do not launch the redirect until they implement one. Without it, DPDP §6(1) "as easy to withdraw as to give" is not satisfied.

### B.6 Audit & inspection

- MyFinancial may, with 15 days' written notice, audit TaxBuddy's processing activities for the shared data once per year, via an independent auditor at MyFinancial's expense.
- For-cause audits (post-breach, post-regulator action) require only 5 days' notice and TaxBuddy bears reasonable cost.

### B.7 Cross-border transfers

- TaxBuddy must process all MyFinancial-shared data within India.
- Any change to processing jurisdiction (e.g. hiring an offshore sub-processor) requires 90 days' prior notice to MyFinancial and may trigger MyFinancial's right to terminate without penalty.

### B.8 Cooperation with regulators

- TaxBuddy will, within 7 days, cooperate with any Data Protection Board inquiry into data received from MyFinancial, share relevant logs, and not communicate with the regulator about the MyFinancial-shared data without notifying MyFinancial first.

### B.9 Survival

- All confidentiality, indemnity, breach-notification, audit, and data-deletion clauses survive termination of the referral agreement for as long as TaxBuddy holds any data received from MyFinancial.

---

## C. Pre-negotiation prep

Things to confirm internally **before** the first negotiation meeting:

- [ ] MyFinancial's legal signing entity and authorised signatory.
- [ ] Whether MyFinancial holds any SEBI RIA / RA / IA registration. If yes, additional advisory-conflict disclosures may be needed.
- [ ] Whether MyFinancial has a designated Grievance Officer and DPO/privacy lead — required for many of the DPA obligations to be enforceable on our side.
- [ ] Whether MyFinancial's current security stack already meets B.3 standards (so we are not asking TaxBuddy for what we don't do ourselves).
- [ ] Internal sign-off on the proposed commercial range (B.2.A.2) — founder + finance.
- [ ] Cap-table-of-secrets check: anything in this scope that is confidential commercial intelligence vs. publicly known.

---

## D. Things to **not** agree to (red lines)

- Exclusivity (any flavour — channel, category, or geographic) unless tied to a material economic uplift agreed by founder.
- A liability cap on data-breach indemnity.
- Acceptance of unilateral DPA amendments without notice.
- Waiver of audit rights.
- Sub-processor changes without notification.
- MyFinancial collecting payment on behalf of TaxBuddy (would create RBI payment-aggregator exposure).
- TaxBuddy iframing MyFinancial UI or proxying our pages (kills Section 79 safe-harbour).
- Joint controllership language ("joint Data Fiduciary") without bespoke legal review — DPDP treats joint fiduciaries with joint-and-several liability.

---

## E. Next steps

1. Counsel review of this checklist. *Owner: Nithin.*
2. Initial commercial discussion with TaxBuddy (no documents exchanged). *Owner: Rohit / Nithin.*
3. TaxBuddy circulates their standard referral & DPA → compare line-by-line against this checklist → mark up redlines.
4. Two rounds of negotiation max before founder escalation.
5. Sign → onboarding kick-off (technical: webhook setup, consent-withdrawal endpoint, branding asset hand-over).
6. Privacy Policy text (see [03-privacy-policy-and-consent.md](./03-privacy-policy-and-consent.md)) and audit-log (see [05-audit-trail-schema.md](./05-audit-trail-schema.md)) shipped in the same release as the redirect goes live.

---

## F. Reviewers / approvers

- [ ] Founder (Nithin Pushkaran) — commercial terms + red lines
- [ ] External counsel — full contract + DPA legal review
- [ ] Finance — pricing model, GST treatment, payment terms
- [ ] Security — B.3 security standards alignment with MyFinancial's own practice
- [ ] Engineering lead — feasibility of webhook + audit-log integration in B.5
