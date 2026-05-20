# TaxBuddy redirect — compliance docs

**Jira:** [SCRUM-108](https://myfinancial.atlassian.net/browse/SCRUM-108)
**Status:** First-cut drafts complete — pending legal + design review
**Owner:** Rohit Raj
**Last updated:** 2026-05-20

This folder is the compliance package for wiring a TaxBuddy redirect into the MyFinancial dashboard. Each file is independently reviewable but the set is internally consistent — the interstitial spec references the audit-log schema, the ToS clause references the Privacy Policy section, the DPA checklist references the security baseline, etc.

## Files

| # | File | What it covers |
|---|---|---|
| 01 | [Disclosure interstitial + consent UX](./01-disclosure-interstitial-and-consent.md) | Pre-redirect modal copy (plain + pre-filled modes), DPDP-compliant consent checkboxes, frontend component spec, accessibility |
| 02 | [ToS third-party clause](./02-tos-third-party-clause.md) | New "Third-party services" section for the Terms of Service — liability disclaimer, intermediary safe-harbour anchors |
| 03 | [Privacy Policy + Connected Services UX](./03-privacy-policy-and-consent.md) | Privacy Policy section text + Settings → Privacy → Connected services page UX + DPDP Act 2023 compliance map |
| 04 | [Contract + DPA checklist](./04-contract-and-dpa-checklist.md) | Negotiation checklist for the TaxBuddy referral agreement and Data Processing Agreement — red lines, must-haves, pre-negotiation prep |
| 05 | [Audit-trail schema](./05-audit-trail-schema.md) | DB schema, write API, retention, tamper-evidence, monitoring for the consent log the interstitial writes to |

## How the SCRUM-108 angles map to this folder

| SCRUM-108 angle | Where it lives |
|---|---|
| Written agreement with TaxBuddy | 04 |
| Dashboard disclosure (mandatory) | 01 |
| Data privacy — DPDP Act 2023 | 01 + 03 + 05 |
| Update own policies (ToS, Privacy, Cookies) | 02 + 03 |
| Sector overlays (SEBI/IRDAI/ICAI/RBI) | 01 §6 + 04 §A.4, §A.7 |
| Advertising & consumer protection (ASCI, CP Act, GST) | 01 + 02 + 04 §A.2 |
| IT Act "intermediary" status | 02 §8, §9 |
| Audit trail | 05 |

## Ship-order

The launch is a single atomic release — no half-launches:

1. Legal review of 02, 03, 04 → counsel approves clause text and red lines.
2. Founder review of 04 commercial terms.
3. Negotiate + sign TaxBuddy referral agreement + DPA (gated by 04 review).
4. Backend ships audit-log endpoint and schema (05), TaxBuddy webhook handler (per 04 §B.5).
5. Frontend ships interstitial component (01) and Connected Services settings page (03 §2) behind feature flag.
6. Hindi translations of all user-facing copy.
7. Single atomic flag flip — Privacy Policy + ToS update + interstitial + Connected Services + audit log all go live in the same release.

## Blocked / open

- **Jira subtask breakdown.** The current API token for myfinancial.atlassian.net has read-only access to SCRUM-108 — cannot create child tickets or comment. Once permissions are elevated for `rohitgupta2432@gmail.com` (or a higher-privileged token is supplied), a one-shot script can create 8 subtasks mapping to the angle table above.
- **Founder decisions needed.** See 01 §7 open questions Q1-Q5, 02 §6, 03 §5, 04 §C pre-negotiation prep.
- **Hindi translation.** Required for all user-facing copy before launch; not yet started.
