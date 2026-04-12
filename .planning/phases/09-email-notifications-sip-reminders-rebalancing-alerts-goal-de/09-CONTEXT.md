# Phase 9: Email Notifications — Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Automated email notifications for three financial events: SIP payment reminders, portfolio rebalancing alerts, and goal deviation warnings. Emails sent from the Spring Boot backend via AWS SES. Frontend adds a notification preferences UI in dashboard settings.

</domain>

<decisions>
## Implementation Decisions

### Email Delivery Infrastructure
- **D-01:** Email sending lives in the Spring Boot backend (not Next.js) — backend has user data, can run scheduled jobs, already on AWS
- **D-02:** AWS SES for email delivery — consistent with existing AWS stack (Bedrock, DynamoDB)
- **D-03:** Backend exposes new API endpoints: `GET/POST /api/v1/notifications/preferences` for user preferences, `POST /api/v1/notifications/trigger` (internal/admin) for manual triggers
- **D-04:** Scheduled email checks run as Spring Boot @Scheduled cron jobs on the EC2 instance

### Notification Types & Triggers
- **D-05:** Three notification types: SIP reminders, rebalancing alerts, goal deviation alerts
- **D-06:** SIP reminders: monthly email sent 3 days before the user's configured SIP date, listing all active SIP goals with amounts
- **D-07:** Rebalancing alerts: triggered when any asset category drifts >10% from target allocation, checked weekly
- **D-08:** Goal deviation alerts: triggered when projected goal achievement drops below 80% of target, checked monthly
- **D-09:** Each notification type can be independently enabled/disabled by the user

### Email Content & Design
- **D-10:** Branded HTML emails with MyFinancial logo header, green accent (#10B981), responsive layout
- **D-11:** Plain text fallback for all emails (SES multipart)
- **D-12:** Each email includes: personalized greeting, specific financial data triggering the alert, one actionable CTA button linking to the relevant dashboard section
- **D-13:** Footer includes: unsubscribe link (one-click), MyFinancial branding, "You're receiving this because..." explanation

### User Preferences & Opt-out
- **D-14:** New "Notifications" section in dashboard with toggles per notification type
- **D-15:** One-click unsubscribe link in every email — hits a backend endpoint that disables that notification type
- **D-16:** Default: all notifications enabled for new users (opt-out model)
- **D-17:** Preferences stored in the backend user profile (new notification_preferences field)

### Frontend Scope (Next.js)
- **D-18:** Next.js adds: notification preferences UI component in dashboard, proxy route for preferences API
- **D-19:** No email sending from Next.js — all email logic is backend-only
- **D-20:** Unsubscribe page at `/unsubscribe?token=...` that calls the backend to disable notifications

### Claude's Discretion
- Email HTML template structure and exact styling
- Cron schedule timing (specific hour of day)
- Retry logic for failed email sends
- Rate limiting approach for SES

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above.

### Backend API (reference)
- CLAUDE.md Backend API table — existing endpoints at `/api/v1/` that the new notification endpoints follow
- `src/app/api/proxy/[...path]/route.ts` — API proxy pattern for forwarding to Spring Boot

### Data Sources
- `src/hooks/assessment/useGoals.ts` — Goal data structure (SIP amounts, timelines)
- `src/hooks/assessment/useGoalProjection.ts` — Goal feasibility projections
- `src/hooks/assessment/usePortfolioAnalysis.ts` — Asset allocation analysis
- `src/hooks/dashboard/useDashboardSummary.ts` — Central dashboard data

### UI Patterns
- `src/app/(protected)/dashboard/layout.tsx` — Dashboard layout where preferences section would live
- `src/hooks/useAppTheme.ts` — Theme hook for consistent styling

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- API proxy route (`/api/proxy/[...path]`) — forwards requests to Spring Boot with JWT
- Dashboard layout with SectionNav — can add a "Settings" or "Notifications" tab
- useAppTheme hook — ensures notification preferences UI matches current theme
- Assessment store — has all financial data that triggers notifications

### Established Patterns
- TanStack Query for API state management (useQuery/useMutation)
- "use client" for all interactive components
- Inline styles with dark theme palette
- Backend API at `/api/v1/` with JWT authentication

### Integration Points
- Dashboard layout — new tab or section for notification preferences
- Backend `/api/v1/` — new notification endpoints
- AWS SES — new AWS service integration (backend-side only)
- Unsubscribe route — new public Next.js page

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for email notification systems.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 09-email-notifications-sip-reminders-rebalancing-alerts-goal-de*
*Context gathered: 2026-04-12*
