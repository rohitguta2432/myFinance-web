# Phase 5: AI Chat + Admin - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning
**Mode:** Auto-generated (autonomous mode)

<domain>
## Phase Boundary

The Kira AI chat widget is available on assessment and dashboard pages, the admin panel lists users and audit logs, and the application is clean of migration artifacts.

Requirements: CHAT-01, CHAT-02, CHAT-03, ADMIN-01, ADMIN-02, ADMIN-03

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices at Claude's discretion. Key notes:
- Kira chat uses AWS Bedrock (Amazon Nova) via the Spring Boot backend
- Chat widget floats on assessment and dashboard pages (not landing/blog)
- Admin panel reuses existing admin auth (isAuthenticated from src/lib/admin-auth.ts)
- Admin panel is a single page with user list + audit logs tabs

</decisions>

<code_context>
## Existing Code Insights

### Source Files to Port
- /home/t0266li/Documents/myFinance/src/components/ai/AiChatWidget.jsx (Kira chat widget)
- /home/t0266li/Documents/myFinance/src/features/admin/pages/AdminDashboard.jsx (1,025 lines)

### Existing Admin (blog admin — separate from this)
- src/app/blog/admin/ — blog post/comment management (keep as-is)
- src/lib/admin-auth.ts — isAuthenticated() checks admin_session cookie

</code_context>

<specifics>
## Specific Ideas

- Chat widget should only appear on /assessment/* and /dashboard/* routes (not landing, blog, or admin)
- Place it in the (protected) layout so it's available on all authenticated pages

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
