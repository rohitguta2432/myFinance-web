# Phase 9: Email Notifications — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-12
**Phase:** 09-email-notifications-sip-reminders-rebalancing-alerts-goal-de
**Areas discussed:** Email Delivery Infrastructure, Notification Types & Triggers, Email Content & Design, User Preferences & Opt-out
**Mode:** --auto (all decisions auto-selected)

---

## Email Delivery Infrastructure

| Option | Description | Selected |
|--------|-------------|----------|
| Spring Boot backend + AWS SES | Backend has user data, can schedule cron, consistent AWS stack | [auto] |
| Next.js API routes + Resend/SendGrid | Serverless-friendly but no persistent scheduler on Amplify | |
| Dedicated email microservice | Over-engineered for current scale | |

**User's choice:** [auto] Spring Boot backend + AWS SES
**Notes:** Backend already has all financial data needed for triggers. EC2 can run @Scheduled cron jobs.

---

## Notification Types & Triggers

| Option | Description | Selected |
|--------|-------------|----------|
| Three types: SIP reminders, rebalancing alerts, goal deviations | Matches phase name, covers key financial events | [auto] |
| SIP reminders only | Too limited for the phase scope | |
| Five types (add tax deadline, insurance renewal) | Scope creep beyond phase boundary | |

**User's choice:** [auto] Three types
**Notes:** SIP monthly, rebalancing weekly check, goal deviation monthly check.

---

## Email Content & Design

| Option | Description | Selected |
|--------|-------------|----------|
| Branded HTML with plain text fallback | Professional, consistent with app branding | [auto] |
| Plain text only | Simpler but less engaging | |
| Rich interactive emails (AMP) | Over-engineered, poor client support | |

**User's choice:** [auto] Branded HTML + plain text fallback
**Notes:** Green accent (#10B981), responsive, actionable CTA buttons linking to dashboard.

---

## User Preferences & Opt-out

| Option | Description | Selected |
|--------|-------------|----------|
| Dashboard toggles + one-click unsubscribe | Standard practice, compliance-friendly | [auto] |
| Email-only unsubscribe | No in-app management | |
| Granular per-goal settings | Too complex for initial implementation | |

**User's choice:** [auto] Dashboard toggles + one-click unsubscribe
**Notes:** Opt-out model (enabled by default). Preferences stored in backend user profile.

---

## Claude's Discretion

- Email HTML template structure
- Cron schedule timing
- Retry logic and rate limiting

## Deferred Ideas

None.
