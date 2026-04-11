# Testing Patterns

**Analysis Date:** 2026-04-11

## Test Framework

**Status:** Not configured

- **Runner:** No test runner installed (Jest, Vitest, or similar not in dependencies)
- **Assertion Library:** No test assertion library installed
- **Test Files:** No test files exist in the codebase
- **Config:** No `jest.config.*`, `vitest.config.*`, or test configuration files present

**Why Testing is Absent:**
The codebase (`package.json`) contains no testing dependencies. The project is in early/active development phase focused on feature delivery rather than comprehensive test coverage. Given the stack (Next.js 15, React 19), integration with AWS services (DynamoDB, Bedrock), and UI-heavy nature, manual testing and API testing via browser/client may be sufficient for current phase.

## Run Commands

If testing were configured, the expected commands would be:

```bash
npm test              # Run all tests (not currently available)
npm test -- --watch  # Watch mode (not currently available)
npm test -- --coverage  # Coverage report (not currently available)
```

## Development Testing Approach

**Current Practice:** Manual testing through development

- **Browser Testing:** Components tested manually in dev server (`npm run dev`)
- **API Testing:** Routes tested via:
  - Browser fetch/XHR calls from client components
  - Manual cURL/Postman-like requests to API routes
  - Integration via UI (e.g., comment submission, blog post creation)
- **Build Validation:** `npm run build` ensures TypeScript compilation succeeds
- **Linting:** `npm run lint` (ESLint) validates code style

## Code Paths Subject to Manual Testing

**Client Components (UI Layer):**
- `src/components/blog/blog-card.tsx` — Featured and standard card rendering, category colors
- `src/components/blog/comment-section.tsx` — Comment form, reply threading, list rendering
- `src/app/blog/admin/page.tsx` — Admin login, posts/comments management tables
- `src/app/blog/admin/editor/page.tsx` — Editor functionality (assumed, check file for details)

**API Routes (Backend Layer):**
- `src/app/api/admin/posts/route.ts` — GET (list), POST (create), PUT (update), DELETE
- `src/app/api/admin/comments/route.ts` — Comment CRUD operations (file not examined)
- `src/app/api/blog/posts/route.ts` — Public GET with filtering, pagination
- `src/app/api/blog/comments/route.ts` — Public comment submission and listing
- `src/app/api/admin/import-url/route.ts` — URL scraping and content extraction
- `src/app/api/admin/ai-write/route.ts` — AI-powered content generation via Bedrock
- `src/app/api/auth/google/route.ts` — Google OAuth flow (file not examined)

**Utility Functions:**
- `src/lib/dynamodb.ts` — DynamoDB client initialization and table constants
- `src/lib/admin-auth.ts` — Session cookie validation and hashing
- `src/lib/auth.ts` — JWT token decoding and session retrieval

## Error Handling in Code

The codebase includes error handling patterns that should be tested:

**API Error Handling:**
- Authentication checks with 401 response (e.g., `isAuthenticated()` in admin routes)
- Input validation with 400 response (e.g., slug required, URL format validation)
- Try-catch blocks with 500 response and error logging
- Example from `src/app/api/blog/posts/route.ts`:
  ```typescript
  try {
    // operation
  } catch (error) {
    console.error("Blog posts API error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch posts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  ```

**Client Error Handling:**
- Comment submission failures gracefully (silent or error message)
- Loading states during fetch operations
- Empty state rendering when no data
- Example from `src/components/blog/comment-section.tsx`:
  ```typescript
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // ... later in render:
  {loading ? <div>Loading comments...</div> : ...}
  ```

## Test Coverage Gaps (Critical Areas)

**High Priority - Business Logic:**
1. **Blog Post CRUD** (`src/app/api/admin/posts/route.ts`)
   - Reading time calculation logic (200 words/min)
   - Status transitions (draft → published, timestamps)
   - Slug uniqueness enforcement
   - Test: Calculate reading time for edge cases (0 words, 1 word, 10000+ words)

2. **URL Import & Scraping** (`src/app/api/admin/import-url/route.ts`)
   - HTML parsing with Readability library
   - Markdown conversion with Turndown
   - Cover image extraction (og:image, first img tag)
   - Metadata fallback chain (og:title → doc.title)
   - Test: Various HTML documents, missing og tags, invalid URLs, timeout scenarios

3. **Comment Threading** (`src/components/blog/comment-section.tsx`)
   - Parent/child comment relationship in render
   - Reply form visibility toggling
   - Comment count calculation with nested replies
   - Test: Thread depth, empty replies array, missing parent_id

4. **Admin Authentication** (`src/lib/admin-auth.ts`)
   - SHA256 hash matching of ADMIN_PASSWORD env var
   - Cookie presence validation
   - Test: Missing cookie, invalid hash, env var not set

**Medium Priority - Data Integration:**
5. **DynamoDB Queries** (`src/app/api/blog/posts/route.ts`)
   - GSI query by status with index name "status-published_at-index"
   - Pagination logic (page, limit, offset calculation)
   - Category and exclusion filtering
   - Test: Pagination boundaries, empty result sets, filter combinations

6. **JWT Decoding** (`src/lib/auth.ts`)
   - Base64URL decoding of JWT payload
   - Expiration check (`exp` claim)
   - Malformed token handling
   - Test: Expired tokens, missing exp claim, invalid base64

**Lower Priority - UI/UX:**
7. **Responsive Layout** (various components)
   - Featured card two-column grid on desktop
   - Mobile sticky CTA visibility
   - Comment form layout adjustments
   - Test: Viewport breakpoints, touch interactions

8. **Form Validation** (admin, comments)
   - Required field validation
   - Email format validation
   - Trim/cleanup of input
   - Test: Whitespace handling, special characters

## Recommended Testing Strategy if Implemented

**Phase 1 (Critical):**
- Unit tests for utility functions: `isAuthenticated()`, `decodeJwtPayload()`, reading time calculation
- Integration tests for API routes: POST/PUT/GET posts with various inputs
- Component tests for comment threading logic

**Phase 2 (Important):**
- End-to-end tests for admin workflows (login → create post → publish)
- Error scenario testing (network failures, malformed data)
- DynamoDB query tests with mock data

**Phase 3 (Polish):**
- Visual regression tests for key UI components
- Performance tests for page load and API response times
- Accessibility tests for admin dashboard

## TypeScript as Guardrail

**Note:** The codebase relies heavily on TypeScript (`strict: true` in `tsconfig.json`) for type safety, which catches many bugs at compile time:
- Type mismatches in component props
- Missing required properties in API payloads
- Incorrect function signatures
- Enum/union type violations

This reduces (but does not eliminate) the need for runtime tests.

---

*Testing analysis: 2026-04-11*
