# Architecture

**Analysis Date:** 2026-04-11

## Pattern Overview

**Overall:** Layered Server-Client Architecture with Next.js 15 App Router

**Key Characteristics:**
- Server-side rendering with React Server Components for public pages
- API-driven backend with protected admin routes
- Client-side state management for blog readers and admin dashboard
- AWS DynamoDB as single source of truth for content
- AWS Bedrock for AI-assisted content generation
- Middleware-based authentication for protected routes

## Layers

**Presentation Layer (Client):**
- Purpose: Render UI components, handle user interactions, manage client state
- Location: `src/components/`, `src/app/*/page.tsx`
- Contains: React components (landing sections, blog UI, admin dashboard), page components
- Depends on: API routes, utility functions, type definitions
- Used by: Browser clients accessing public and authenticated pages

**API Route Layer:**
- Purpose: Handle HTTP requests, implement business logic, enforce authentication
- Location: `src/app/api/`
- Contains: RESTful route handlers for blog CRUD, comments, auth, and AI services
- Depends on: DynamoDB client, AWS Bedrock client, authentication utilities
- Used by: Frontend components via fetch calls, external systems (webhooks)

**Service/Integration Layer:**
- Purpose: Abstract AWS services (DynamoDB, Bedrock), provide reusable interfaces
- Location: `src/lib/dynamodb.ts`, `src/lib/auth.ts`, `src/lib/admin-auth.ts`
- Contains: Database client initialization, authentication logic, type definitions
- Depends on: AWS SDK clients
- Used by: API routes

**Data Layer:**
- Purpose: Persistent storage and document management
- Location: AWS DynamoDB tables
- Contains: Blog posts (`myfinancial-blog-posts`), comments (`myfinancial-comments`)
- Key structure: Posts use `PK: POST#{slug}`, global secondary index on `status-published_at-index`

## Data Flow

**Blog Post Reading (Public):**

1. User visits `/blog/[slug]`
2. Client component (`src/app/blog/[slug]/page.tsx`) fetches post via `GET /api/blog/posts?slug={slug}`
3. API queries DynamoDB with `PK: POST#{slug}`, verifies `status: published`
4. Response includes full post content (Markdown), metadata, key takeaways
5. Client renders with `marked` library for Markdown-to-HTML conversion
6. Related posts fetched separately via `GET /api/blog/posts?category={category}&exclude={id}`

**Blog Post Admin Workflow:**

1. Admin authenticates via `/blog/admin` with password
2. Session cookie `admin_session` set with SHA256 hash of password
3. Admin creates/edits post via `POST /api/admin/posts` or `PUT /api/admin/posts`
4. Optional: Request AI enhancement via `POST /api/admin/ai-write` with action (`generate`, `improve`, `summarize`, `takeaways`)
5. Bedrock model (`us.amazon.nova-pro-v1:0`) processes prompt with financial blog system context
6. Admin publishes post (sets `status: published`, `published_at: now`)
7. Post becomes queryable via public API and GSI scan

**Comment Flow:**

1. User submits comment on blog post via `POST /api/blog/comments`
2. Comment stored in DynamoDB with `parent_id` for nested replies
3. Comments displayed inline on post page via `src/components/blog/comment-section.tsx`

**State Management:**

- Public pages: Minimal client state, primarily server-rendered with React Server Components
- Blog detail page: useState for post data, related posts, loading state, scroll progress
- Admin dashboard: useState for authentication, tab switching (posts/comments), CRUD operations
- Auth: Global `AuthProvider` wraps app with Google OAuth context, manages user sessions

## Key Abstractions

**BlogPost Interface:**
- Purpose: Type-safe representation of blog content
- Location: `src/lib/types.ts`
- Definition: id, slug, title, excerpt, content (Markdown), category, tags, author, status, reading_time, key_takeaways, published_at
- Pattern: Union type for BlogCategory (18 predefined categories), flags for draft/published status

**Comment Interface:**
- Purpose: Thread-based comment system
- Location: `src/lib/types.ts`
- Definition: post_id, parent_id (for nesting), author_name, content, is_admin flag, likes
- Pattern: Self-referential via parent_id for reply hierarchies

**DynamoDB Document Client:**
- Purpose: Abstract AWS SDK for database operations
- Location: `src/lib/dynamodb.ts`
- Pattern: Singleton initialized with environment credentials, marshalling configured to remove undefined values
- Exported functions: docClient, TABLES constant

**Admin Authentication:**
- Purpose: Protect admin API routes
- Location: `src/lib/admin-auth.ts`
- Pattern: Request middleware checks `admin_session` cookie against SHA256(ADMIN_PASSWORD)
- Used by: All `/api/admin/*` routes via isAuthenticated() guard

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page request
- Responsibilities: Set metadata (SEO, OG tags), wrap with AuthProvider (Google OAuth), render Navbar, Footer, main content, MobileStickyCTA

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: GET /
- Responsibilities: Compose landing page with Hero, DashboardPreview, Problems, Tax, HowItWorks, Pricing, Testimonials, Founder sections

**Blog Index:**
- Location: `src/app/blog/page.tsx`
- Triggers: GET /blog
- Responsibilities: List all published posts, filtering by category, pagination

**Blog Post Detail:**
- Location: `src/app/blog/[slug]/page.tsx`
- Triggers: GET /blog/{slug}
- Responsibilities: Fetch and render single post with TOC, related articles, comments, reading progress indicator

**Admin Dashboard:**
- Location: `src/app/blog/admin/page.tsx`
- Triggers: GET /blog/admin
- Responsibilities: Login form, tab-based UI for posts and comments management, CRUD operations

**Admin Editor:**
- Location: `src/app/blog/admin/editor/page.tsx`
- Triggers: GET /blog/admin/editor (protected)
- Responsibilities: Rich editing interface for blog posts, AI assistant integration

## Error Handling

**Strategy:** Layered error boundaries with user-friendly fallbacks

**Patterns:**

- API routes return NextResponse.json with explicit error messages and HTTP status codes
- Try-catch blocks in all async operations (database, external APIs, parsing)
- Bedrock-specific error handling: checks for `AccessDeniedException`, `ThrottlingException` to provide actionable messages
- Client-side: Shimmer loading skeletons during fetch, 404 page for missing posts, error toasts from failed mutations
- Graceful degradation: AuthProvider falls back to unauth content if Google OAuth not configured

## Cross-Cutting Concerns

**Logging:** console.error for server-side errors (database, AWS API failures), prefixed with operation context

**Validation:** 
- Frontend: Basic form validation in components
- Backend: Request body validation in API routes (check required fields like title, slug, password)
- Database constraints: DynamoDB schema enforces PK requirement

**Authentication:**
- Public routes: No auth required (blog index, post detail, landing pages)
- Dashboard: Google OAuth via `@react-oauth/google` library, stores session token in cookie
- Admin routes: SHA256 password hashing, session cookie validation via isAuthenticated() middleware
- Middleware redirects unauthenticated users from `/dashboard/*` to home

**Authorization:**
- Public API routes: No checks (blog/posts, blog/comments GET)
- Admin API routes: isAuthenticated() guard blocks unauthorized requests with 401 status
- Page-level: Middleware on `/dashboard/*` routes enforces session presence

---

*Architecture analysis: 2026-04-11*
