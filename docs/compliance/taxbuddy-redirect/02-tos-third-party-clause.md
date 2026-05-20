# TaxBuddy redirect — Terms of Service "Third-party services" clause

**Jira:** SCRUM-108
**Status:** Draft — pending legal review
**Owner:** Rohit Raj
**Last updated:** 2026-05-20

This is the new ToS clause that must be inserted into the MyFinancial Terms of Service before the TaxBuddy redirect ships. It disclaims liability for third-party services, names TaxBuddy explicitly, and aligns with the IT Act intermediary safe-harbour requirements.

---

## 1. Where it goes

Insert as a top-level section between **"Your account"** and **"Acceptable use"** in the current ToS. Anchor: `#third-party`. Linked from:

- The redirect interstitial sublabel (see [01-disclosure-interstitial-and-consent.md](./01-disclosure-interstitial-and-consent.md))
- The dashboard footer "Legal" menu
- The TaxBuddy connected-service settings row (see [03-privacy-policy-and-consent.md](./03-privacy-policy-and-consent.md))

---

## 2. Clause text (English — for legal review)

### Third-party services

**1. What this section covers.** From time to time, MyFinancial may direct you to services operated by independent third parties — including, but not limited to, **TaxBuddy** (operated by Finbingo Wealth Tech Private Limited) for income-tax return filing. Each of these third parties is a separate company. MyFinancial does not own, control, operate, or supervise any third-party service.

**2. Your relationship is with the third party.** When you click through to a third-party service, you enter a separate contract directly with that third party, governed by *their* terms of service, *their* privacy policy, and the laws applicable to *their* services. MyFinancial is not a party to that contract and does not act as your agent in dealings with the third party.

**3. No warranty from MyFinancial.** MyFinancial makes no representation or warranty — express or implied — about the quality, accuracy, timeliness, lawfulness, refund policy, customer support, or any other aspect of any third-party service. Any reference, link, branded surface, or co-branded UI element pointing to a third-party service does not constitute an endorsement, recommendation, or guarantee.

**4. No liability for third-party acts or omissions.** To the maximum extent permitted by applicable law, MyFinancial shall not be liable for any loss, damage, claim, fee, penalty, refund dispute, mis-filing, tax demand, or other consequence arising out of or in connection with your use of a third-party service, including service failures, breaches, errors, or terms changes by the third party. Your sole recourse for any such issue is against the third party itself, in accordance with their terms.

**5. Commercial relationship and disclosure.** MyFinancial may receive a referral fee, commission, or other consideration from a third party when you sign up, file, transact, or otherwise use their service through a link or interface on MyFinancial. This disclosure is provided in compliance with the Consumer Protection (E-Commerce) Rules, 2020 and the Advertising Standards Council of India ("ASCI") guidelines on material connections. This consideration does not increase the price you pay the third party, and it does not influence MyFinancial's editorial content or product recommendations.

**6. Data shared with third parties.** Where you consent to MyFinancial sharing personal data with a third party (for example, to pre-fill a form on TaxBuddy), the scope, lawful basis, and your rights under the Digital Personal Data Protection Act, 2023 ("DPDP Act") are set out in our [Privacy Policy](./privacy.md#third-party-sharing). You may withdraw consent at any time via **Settings → Privacy → Connected services**; withdrawal will stop further sharing but does not affect data already received and held by the third party under their own retention policy.

**7. Brand and trademarks.** Where a third-party logo, name, or brand element appears in the MyFinancial interface ("Powered by TaxBuddy" or similar), it is used under licence from the third party. Such use does not transfer any ownership or imply a joint venture, partnership, agency, or merger between MyFinancial and the third party.

**8. Grievance and takedown.** If you believe a third-party service accessed via MyFinancial has acted unlawfully, deceptively, or in a way that affects your rights, you may notify MyFinancial's Grievance Officer (see Section [Grievance & contact]) and we will, in our capacity as an intermediary under Section 79 of the Information Technology Act, 2000 read with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, act on lawful take-down requests within the timelines those rules prescribe. This does not create any new liability on MyFinancial beyond what those rules require.

**9. No modification.** MyFinancial does not modify, transform, or repackage the content, output, or filings produced by a third-party service. Where you continue to a third-party site, you interact with their service as they provide it.

**10. Survival.** This section survives termination of these Terms for any matter that arose during the period in which you used a third-party service via MyFinancial.

---

## 3. Drafting notes for counsel

- **Section 4 cap.** The blanket liability disclaimer must be read with the general limitation-of-liability cap elsewhere in the ToS. If MyFinancial collects a fee from the user (it currently does not, for the TaxBuddy flow), the cap rules under Consumer Protection Act 2019 §83-§84 may treat MyFinancial as a "marketplace e-commerce entity" rather than a pure intermediary, and the disclaimer's enforceability narrows. Re-check before any flow where MyFinancial takes user money on behalf of a third party.
- **Section 5 commission language.** Keep generic unless legal clears naming the percentage. ASCI's 2026 update (clause 7.2) requires "clear and conspicuous" disclosure but does not mandate exact amounts.
- **Section 6 cross-reference.** Must align verbatim with the Privacy Policy section it points at — divergence creates DPDP-grievance ammunition.
- **Section 7 trademark licence.** Will be valid only after the TaxBuddy referral agreement is signed (see [04-contract-and-dpa-checklist.md](./04-contract-and-dpa-checklist.md)). Until then, do not show the TaxBuddy logo — text-only CTA is safe.
- **Section 8 grievance officer.** MyFinancial must have a designated Grievance Officer published on the site per IT Rules 2021 r.3(2)(d). Confirm current designee and contact before ToS publishes.
- **Section 9 no-modification.** This is the safe-harbour anchor under Section 79(2)(b) IT Act. Any A/B test, banner, or wrapper around TaxBuddy content risks weakening this — engineering must keep the redirect strictly link-out, not iframe/proxy.

---

## 4. Hindi translation

Required before launch. Translate sections 1–10 line-by-line, retaining statutory references in original form (e.g. "DPDP Act, 2023" stays in English). Hindi translation must be reviewed by a person fluent in Indian legal Hindi, not machine-translated.

---

## 5. Versioning & change log

Each material amendment to this section bumps the ToS version. Users must be re-prompted at next login when the section that *applies to them* changes — e.g. a user who has consented to TaxBuddy data sharing must re-consent if Section 6 wording changes materially.

Track the section version separately from the parent ToS version so users aren't re-prompted for unrelated edits elsewhere in the document.

---

## 6. Open questions

1. Does the current ToS already have a "Limitation of liability" cap clause? If so, paste a link here and confirm the cap interacts cleanly with Section 4 above.
2. Is the legal entity name "MyFinancial" or "MyFinancial Pvt Ltd" / "MyFinancial Technologies Pvt Ltd"? The clause must name the contracting entity precisely.
3. Confirm Finbingo Wealth Tech Pvt Ltd is the legal operator of TaxBuddy (this is current public info but must be re-verified at signing time).
4. Is there an existing Grievance Officer designation on the site? If not, this clause must wait for that appointment.

---

## 7. Reviewers needed before merge

- [ ] Legal (external counsel or Nithin) — clause-by-clause review
- [ ] Hindi translator — Hindi version
- [ ] Operations — Grievance Officer designation confirmation
- [ ] Frontend — anchor links update (`#third-party`)
