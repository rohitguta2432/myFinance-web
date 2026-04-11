# Codebase Concerns

**Analysis Date:** 2026-04-11

## Security Issues

**Weak Admin Authentication:**
- Issue: Admin authentication relies on a single environment variable password hashed with SHA-256. Session validation is deterministic (always hashes to the same value).
- Files: `src/lib/admin-auth.ts`, `src/app/api/admin/auth/route.ts`
- Impact: Session token can be forged if ADMIN_PASSWORD is discovered. No per-request nonce or expiration per session.
- Fix approach: Implement proper JWT tokens with expiration, use bcrypt for password hashing, add rate limiting to admin login endpoint, generate unique session tokens per login.

**HTML Injection Risk in Blog Content:**
- Issue: Blog content is rendered after Markdown parsing via marked library. Content authored by admin users is rendered with HTML interpretation, creating potential for unsafe content injection.
- Files: `src/app/blog/[slug]/page.tsx` (line 306 uses setInnerHTML), `src/components/blog/table-of-contents.tsx`
- Impact: If admin account is compromised or markdown parser is bypassed, malicious scripts could execute in readers' browsers.
- Fix approach: Use HTML sanitization library (DOMPurify or sanitize-html) before rendering. Configure marked with restricted renderer that escapes dangerous elements. Implement content security policy headers.

**No Input Validation on Admin Routes:**
- Issue: Admin API routes accept JSON body without schema validation (e.g., POST `/api/admin/posts`).
- Files: `src/app/api/admin/posts/route.ts`, `src/app/api/admin/comments/route.ts`, `src/app/api/admin/ai-write/route.ts`
- Impact: Invalid or oversized data could corrupt database or cause runtime errors.
- Fix approach: Use Zod or similar schema validator to validate request bodies before processing.

**URL Fetching Without Host Validation:**
- Issue: `/api/admin/import-url` accepts any URL and fetches it. No checks for private IPs, localhost, or internal networks.
- Files: `src/app/api/admin/import-url/route.ts` (lines 30-44)
- Impact: SSRF attack vector - attacker could fetch internal services, cloud metadata endpoints, or local files via file:// URLs.
- Fix approach: Validate and reject URLs pointing to private IP ranges (127.0.0.1, 10.x.x.x, 172.16-31.x.x, 192.168.x.x). Block file://, ftp:// schemes. Add URL scheme whitelist.

**AWS Credentials in Environment Variables:**
- Issue: AWS access keys stored in plaintext environment variables that fall back to multiple env var names.
- Files: `src/lib/dynamodb.ts` (lines 7-8), `src/app/api/admin/ai-write/route.ts` (lines 14-20)
- Impact: Secrets could be logged, exposed in error messages, or leaked via source control.
- Fix approach: Use AWS IAM roles for authentication (Amplify Hosting provides this). Remove fallback env var chains. Never commit .env files.

## Tech Debt

**Monolithic Editor Component:**
- Issue: `src/app/blog/admin/editor/page.tsx` is 1305 lines in a single client component with multiple sub-components (ImportUrlPanel, AiModal, etc.) defined inline.
- Files: `src/app/blog/admin/editor/page.tsx`
- Impact: Hard to test, difficult to reuse components, makes future refactoring risky.
- Fix approach: Extract ImportUrlPanel, AiModal, and form sections into separate files under `src/components/blog/admin/`. Create custom hooks for form state management.

**Session Cookie Mismatch:**
- Issue: Two session cookies set at login (admin_token and admin_session), but only admin_session is validated in isAuthenticated(). The admin_token is unused.
- Files: `src/app/api/admin/auth/route.ts` (lines 22-38), `src/lib/admin-auth.ts` (line 8)
- Impact: Dead code, potential confusion during maintenance, unused storage overhead.
- Fix approach: Choose one session mechanism. Use JWT (admin_token) and remove the password-hash cookie approach entirely.

**Catch Blocks Without Type Guards:**
- Issue: Multiple catch blocks use unsafe type narrowing: `err instanceof Error ? err.message : "Import failed"` without null checks.
- Files: `src/app/blog/admin/editor/page.tsx` (lines 103-104, 321-323), `src/app/api/admin/import-url/route.ts` (lines 104-105)
- Impact: Non-Error thrown objects lose stack traces and context. Silent failures if error is not an Error instance.
- Fix approach: Implement a global error handler. Create an AppError class. Always catch with type guards.

**Inconsistent Error Handling:**
- Issue: Some routes return generic 500 errors without details. Comment submission and post deletion have no error feedback to the user.
- Files: `src/components/blog/comment-section.tsx` (lines 42-56), `src/app/blog/admin/page.tsx` (lines 88-98)
- Impact: Silent failures - users don't know if their action succeeded or failed.
- Fix approach: Add explicit error states to components. Check fetch response status and display error messages. Add toast notifications or error dialogs.

**Hardcoded Admin Credentials:**
- Issue: Default admin username is "admin" if ADMIN_USERNAME env var is missing.
- Files: `src/app/api/admin/auth/route.ts` (line 7)
- Impact: Weak default makes local dev insecure if deployed without proper env setup.
- Fix approach: Require env var explicitly. Throw error if not set rather than defaulting.

## Performance Bottlenecks

**Full DynamoDB Scans:**
- Issue: Admin dashboard fetches all posts and comments via ScanCommand without pagination or filtering.
- Files: `src/app/api/admin/posts/route.ts` (line 14), `src/app/api/admin/comments/route.ts` (line 14)
- Impact: Will be slow and expensive with thousands of items. No pagination support.
- Fix approach: Implement pagination with limit and ExclusiveStartKey. Add limit query parameter. Consider GSI (Global Secondary Index) for common queries (e.g., by category).

**Markdown Parsing on Every Render:**
- Issue: Blog post markdown is parsed with marked.parse() on every component render in useMemo.
- Files: `src/app/blog/[slug]/page.tsx` (lines 74-92)
- Impact: Unnecessary computation if content hasn't changed. Large posts take time to render.
- Fix approach: Parse and cache markdown HTML at write time (during POST/PUT). Store contentHtml in DynamoDB alongside content. Use server-side rendering where possible.

**No Image Optimization:**
- Issue: Blog cover images and imported images from URLs are served as-is without optimization (no srcset, no lazy loading).
- Files: `src/components/blog/blog-card.tsx`, `src/app/blog/[slug]/page.tsx`
- Impact: Large images slow page load. Bandwidth waste on mobile devices.
- Fix approach: Use Next.js Image component with responsive loading and sizes attribute. Optimize images at import time using AWS Lambda or service.

**Comment Fetch on Every Render:**
- Issue: Comments are fetched when component mounts, but re-fetched every time postId changes even if it hasn't actually changed.
- Files: `src/components/blog/comment-section.tsx` (lines 33-35)
- Impact: Unnecessary API calls if dependencies cause re-renders.
- Fix approach: Ensure postId is stable (doesn't change on parent re-render). Add explicit refetch only on user actions.

## Fragile Areas

**Bedrock AI Generation Fragility:**
- Issue: AI write feature assumes specific response format and includes manual JSON parsing with fallback text splitting.
- Files: `src/app/api/admin/ai-write/route.ts` (lines 167-175)
- Impact: If Bedrock API changes response format, takeaway extraction silently fails and returns text array instead of structured takeaways.
- Fix approach: Add schema validation for AI responses. Add explicit error handling if JSON parsing fails. Test with various model responses.

**URL Import Content Extraction:**
- Issue: Content extraction relies on Readability library which may fail or return empty content for certain page structures.
- Files: `src/app/api/admin/import-url/route.ts` (lines 67-75)
- Impact: Non-standard HTML layouts cause import to fail with vague error. User must manually retry or abandon.
- Fix approach: Add detailed logging of what extracted. Return partial data (title + excerpt) even if content fails. Add fallback heuristics.

**Untyped API Responses:**
- Issue: Many fetch() calls parse JSON without type safety. Comment data and blog posts are cast to types after fetch but errors are silent.
- Files: `src/app/blog/[slug]/page.tsx` (line 51), `src/app/blog/admin/page.tsx` (line 56)
- Impact: Mismatched API schema causes runtime errors. No compile-time guarantee of data shape.
- Fix approach: Create response validators using Zod. Parse and validate all API responses. Add discriminated union types for success/error responses.

**Slug-Based Queries Without Indexes:**
- Issue: Public blog post fetch uses slug parameter in query but DynamoDB primary key is PK: POST#{slug}. Query is implemented as filter on scan results.
- Files: `src/app/api/blog/posts/route.ts` (in client fetch at `src/app/blog/[slug]/page.tsx`)
- Impact: Slow queries as data grows. Index not optimized for this access pattern.
- Fix approach: Implement GSI with slug as partition key for fast lookups.

## Test Coverage Gaps

**No Tests for Admin Routes:**
- Issue: Admin authentication, post CRUD, and comment moderation have zero test coverage.
- Files: `src/app/api/admin/*`
- Risk: Auth bypass, data corruption, API contract changes undetected.
- Priority: High

**No Tests for Authentication:**
- Issue: Session validation and Google OAuth flow have no automated tests.
- Files: `src/lib/admin-auth.ts`, `src/app/api/auth/google/route.ts`, `src/lib/auth.ts`
- Risk: Auth logic regressions break user access and admin protection.
- Priority: High

**No E2E Tests:**
- Issue: No end-to-end tests for user workflows (view blog, comment, admin create/edit/delete post).
- Risk: Full user flows could break without detection (e.g., blog rendering, comment posting).
- Priority: Medium

**No Integration Tests for DynamoDB:**
- Issue: No tests verify DynamoDB queries are correct (scan filters, key schemas).
- Risk: Data queries silently return wrong results as schema evolves.
- Priority: Medium

## Scaling Limits

**Single DynamoDB Table Design:**
- Issue: All blog posts and comments in single partition key schema. No partitioning strategy for scaling.
- Files: `src/lib/dynamodb.ts`, schema usage in all admin/blog API routes
- Current capacity: Suitable for ~10k posts, breaks at ~100k with hot partitions.
- Limit: On-demand DynamoDB will auto-scale but becomes expensive. Query performance degrades with large result sets.
- Scaling path: Implement date-based partitioning (PK: POST#YYYY-MM, SK: slug). Add GSI for category queries.

**Bedrock Request Rate Limits:**
- Issue: No rate limiting on `/api/admin/ai-write`. Single admin could saturate Bedrock quota.
- Files: `src/app/api/admin/ai-write/route.ts`
- Current capacity: Bedrock standard limits (typically 10-50 req/min depending on model).
- Limit: Multiple concurrent AI writes will throttle (HTTP 429).
- Scaling path: Implement request queue with Bull or AWS SQS. Add per-user rate limiting.

**No Content Delivery Network:**
- Issue: All assets and blog content served from origin without caching or CDN.
- Current capacity: AWS Amplify hosting can handle ~1000 concurrent users before degrading.
- Scaling path: Enable CloudFront CDN for static assets. Cache blog posts with long TTL.

## Missing Critical Features

**No Moderation Queue:**
- Issue: Comments are immediately visible after posting. No admin review/approval workflow.
- Impact: Spam and inappropriate comments appear instantly.
- Blocks: Professional blog operation.

**No Scheduled Publishing:**
- Issue: Blog posts are published immediately. No ability to schedule future publish dates.
- Impact: Cannot pre-write content for future release.
- Blocks: Content calendar workflows.

**No Revision History:**
- Issue: When posts are edited, old versions are overwritten. No audit trail or ability to revert.
- Impact: Accidental deletions cannot be recovered. Changes are not tracked.
- Blocks: Content compliance and audit requirements.

**No Analytics:**
- Issue: No tracking of page views, bounce rates, or user engagement.
- Impact: Cannot measure blog effectiveness or identify popular content.
- Blocks: Data-driven content strategy.

## Dependencies at Risk

**AWS SDK Version Pinning:**
- Risk: AWS SDK dependencies pinned to very high versions (3.1000.0, 3.1025.0) with no upper bound.
- Files: `package.json` (dependencies)
- Impact: Future breaking changes could break builds.
- Migration plan: Add caret constraints (^3.1000.0) instead of exact pins. Subscribe to AWS SDK release notes.

**Bedrock Model Hardcoded:**
- Risk: Code references us.amazon.nova-pro-v1:0 directly. If Amazon retires this model, code breaks.
- Files: `src/app/api/admin/ai-write/route.ts` (line 8)
- Impact: AI write feature stops working without code change.
- Migration plan: Make model ID configurable via env var with fallback chain.

**Turndown HTML to Markdown Conversion:**
- Risk: turndown and turndown-plugin-gfm are old (2023). No type support and limited maintenance.
- Files: `src/app/api/admin/import-url/route.ts` (lines 4-5, 9-14)
- Impact: HTML edge cases may not convert cleanly to Markdown.
- Migration plan: Consider html2md or custom parser. Add tests for various HTML formats.

---

*Concerns audit: 2026-04-11*
