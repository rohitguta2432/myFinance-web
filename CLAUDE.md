# myFinance-web

Personal finance platform built with Next.js 15 (App Router), React 19, Tailwind CSS 4, AWS DynamoDB, and AWS Bedrock.

## Stack

- **Framework**: Next.js 15 with Turbopack (`npm run dev`)
- **UI**: React 19, Radix UI, Lucide icons, Tailwind CSS 4
- **Database**: AWS DynamoDB (tables: `myfinancial-blog-posts`, `myfinancial-comments`)
- **AI**: AWS Bedrock (Amazon Nova Pro) for blog content generation
- **Deployment**: AWS Amplify (auto-deploys on push to `main`)
- **Content**: Cheerio for URL scraping, Marked for Markdown rendering

## Project Structure

- `src/app/` — Next.js App Router pages and API routes
- `src/app/api/admin/` — Protected admin API routes (blog CRUD, URL import, AI write)
- `src/app/api/blog/` — Public API routes (posts listing, comments)
- `src/app/blog/` — Public blog pages and admin dashboard
- `src/components/blog/` — Blog components (card, TOC, share bar, comments)
- `src/lib/` — Shared utilities (DynamoDB client, auth, types)

## Conventions

- All styles use inline styles or component-scoped `<style>` tags (no CSS modules)
- Colors use the dark theme palette: backgrounds `#0B0F1A`/`#0F172A`, text `#F1F5F9`/`#CBD5E1`
- Admin routes are protected via `isAuthenticated()` from `src/lib/admin-auth.ts`
- Blog content is stored as Markdown in DynamoDB, rendered with `marked`
- Category colors are defined as `{ bg, text }` objects in components that need them

## Commands

- `npm run dev` — Start dev server (requires Node 20+, use `nvm use 20`)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `/deploy` — Push to main and monitor Amplify deployment
- `/import-blog <url>` — Import, improve, and publish a blog post from URL

<!-- GSD:project-start source:PROJECT.md -->
## Project

**MyFinancial — React to Next.js Migration**

MyFinancial is a personal finance platform for Indian users. It has a 6-step financial assessment wizard, a 12-calculator dashboard, AI advisory chat, and a blog. The frontend is currently split across two repos — a Next.js landing site (this repo) and a React (Vite) app. This project unifies everything into one Next.js application while keeping the Spring Boot backend on EC2.

**Core Value:** Users complete the financial assessment wizard and see their personalized dashboard — this flow must work end-to-end after migration without regressions.

### Constraints

- **Tech stack**: Next.js 15 App Router, React 19, Tailwind CSS 4, TypeScript
- **Styling**: Inline styles or component-scoped `<style>` tags (no CSS modules) — matches existing project convention
- **Colors**: Dark theme palette — backgrounds `#0B0F1A`/`#0F172A`, text `#F1F5F9`/`#CBD5E1`, accent `#10B981`
- **Backend**: Spring Boot API is unchanged — all endpoints remain the same
- **Auth**: Google OAuth via `@react-oauth/google` with auth-code flow (already implemented)
- **No SSR for assessment/dashboard**: All wizard and dashboard components are `"use client"` — purely interactive
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.7.3 - All source code in `src/`
- JavaScript (JSX/TSX) - React components and Next.js pages
- HTML/CSS via Tailwind CSS 4
## Runtime
- Node.js 20+ (per CLAUDE.md instructions: `nvm use 20`)
- npm (lockfileVersion 3)
- Lockfile: `package-lock.json` present
## Frameworks
- Next.js 15.2.0 - App Router with Turbopack (`npm run dev`)
- React 19.0.0 - Component library
- Radix UI - Headless components (referenced in CLAUDE.md, not explicitly in package.json)
- Lucide React 0.475.0 - Icon library
- Tailwind CSS 4.0.0 - Utility-first styling via postcss
- Marked 17.0.3 - Markdown to HTML rendering (`src/app/blog/[slug]/page.tsx`)
- Cheerio - HTML parsing for URL scraping (mentioned in CLAUDE.md, not found in dependencies - likely bundled or implicit)
- Turndown 7.2.4 - HTML to Markdown conversion
- Turndown Plugin GFM 1.0.2 - GitHub Flavored Markdown support for Turndown
- Mozilla Readability 0.6.0 - Article extraction (used in `src/app/api/admin/import-url/route.ts`)
- JSDOM 29.0.2 - DOM implementation for server-side HTML parsing
- @react-oauth/google 0.13.5 - Google OAuth integration for frontend
- Custom JWT-based session handling via cookies
## Key Dependencies
- @aws-sdk/client-bedrock-runtime 3.1000.0 - AWS Bedrock AI service integration
- @aws-sdk/client-dynamodb 3.1025.0 - DynamoDB database client
- @aws-sdk/lib-dynamodb 3.1025.0 - DynamoDB Document Client for simplified API
- @types/node 22.13.4 - Node.js type definitions
- @types/react 19.0.8, @types/react-dom 19.0.3 - React type definitions
- @types/jsdom 28.0.1 - JSDOM type definitions
- @types/turndown 5.0.6 - Turndown type definitions
## Configuration
- `tsconfig.json` - TypeScript compiler options
- `next.config.ts` - Next.js configuration
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS 4
- `.env.local` present (local development)
- Environment variables build into `.env.production` during Amplify build phase
- ESLint 9 - Code linting
- ESLint Config Next 15.2.0 - Next.js-specific rules
## Environment Variables Required
- `MYAPP_AWS_REGION` - AWS region for DynamoDB (default: us-east-1)
- `BEDROCK_REGION` - AWS region for Bedrock (default: us-east-1)
- `BEDROCK_ACCESS_KEY_ID` - AWS credentials for Bedrock
- `BEDROCK_SECRET_ACCESS_KEY` - AWS credentials for Bedrock
- `DYNAMODB_ACCESS_KEY_ID` - Falls back to BEDROCK_ACCESS_KEY_ID if not set
- `DYNAMODB_SECRET_ACCESS_KEY` - Falls back to BEDROCK_SECRET_ACCESS_KEY if not set
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID (public)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (server-only)
- `BACKEND_URL` - Backend API URL for Google OAuth token exchange
- `ADMIN_USERNAME` - Admin login username (default: "admin")
- `ADMIN_PASSWORD` - Admin login password (hashed with SHA256)
- `NODE_ENV` - "development" or "production" (affects cookie security)
## Platform Requirements
- Node.js 20+ (via nvm: `nvm use 20`)
- npm for package management
- AWS account with:
- AWS Amplify Hosting (auto-deploys from `main` branch)
- App ID: d2yo95fuojyxue
- Requires environment variables in Amplify console:
## Build Output
- Next.js standalone build: `.next/` directory
- Artifacts for Amplify: `.next/` baseDirectory with all files
- Cache paths: `node_modules/**/*` and `.next/cache/**/*`
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Components: `kebab-case.tsx` (e.g., `blog-card.tsx`, `comment-section.tsx`, `auth-provider.tsx`)
- Pages: `kebab-case.tsx` (e.g., `page.tsx` in route directories)
- Utilities/services: `kebab-case.ts` (e.g., `admin-auth.ts`, `dynamodb.ts`)
- Type definitions: `types.ts` (central file with all major types and interfaces)
- PascalCase for React components (both function declarations and exported functions)
- camelCase for utility functions and non-component functions
- Prefix boolean/check functions with `is` or `handle` for event handlers
- camelCase for all local and state variables
- camelCase for function parameters
- UPPERCASE_SNAKE_CASE for constants and environment variables
- PascalCase for type and interface names
- Use `type` for union types and simple aliases
- Use `interface` for object shapes with required properties
- snake_case for CSS custom property names (when used)
- Inline CSSProperties objects with camelCase keys (React convention)
## Code Style
- No explicit formatter configured (ESLint only for linting)
- Default Next.js/TypeScript formatting conventions apply
- Indentation: 4 spaces (inferred from code samples)
- Tool: ESLint 9 with Next.js config (`eslint-config-next`)
- Command: `npm run lint`
- No custom .eslintrc config file (uses Next.js defaults)
- No strict limit enforced, but aim for readability (most lines under 100 characters)
- Use ES6 `import` statements exclusively
- No CommonJS `require()` in source code
- Use TypeScript `type` keyword for importing types:
## Import Organization
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- All internal imports use `@/` absolute path style, never relative paths
- Examples:
## Error Handling
- Use try-catch blocks in async functions and API routes
- Check error type with `error instanceof Error` to access `.message`
- Log errors with `console.error()` including context (e.g., "Admin posts GET error:")
- Return appropriate HTTP status codes from API routes (401 for auth, 400 for validation, 422 for unprocessable, 500 for server errors)
- Provide user-friendly error messages in API responses
- Example from `src/app/api/blog/posts/route.ts`:
- Type-check input variables before use (e.g., `typeof url !== "string"`)
- Return 400 status with error message for invalid input
- Example from `src/app/api/admin/import-url/route.ts`:
## Logging
- Use `console.error()` for errors in try-catch blocks
- Include context/operation name in error logs (e.g., "Admin posts GET error:", "Blog posts API error:")
- Use `console.error()` for client-side issues (e.g., missing env vars)
- No console logging in components for production code (only error cases)
- Example: `console.error("Admin posts GET error:", error);`
## Comments
- Document non-obvious algorithmic logic
- Explain business rules (e.g., why reading time is calculated as ~200 words/min)
- Mark sections in long functions (e.g., `// Extract metadata`, `// Build title`)
- Do not comment obvious code (e.g., `// Set loading to true` above `setLoading(true)`)
- Used minimally - only for utility functions with significant complexity
- Single-line doc comments for functions when needed
- Example from `src/lib/admin-auth.ts`:
## Function Design
- Prefer small, focused functions (single responsibility)
- Component functions typically 50-300 lines (including JSX)
- Utility functions typically under 50 lines
- If function exceeds 150 lines of logic, extract sub-functions
- Use object destructuring for multiple parameters in components
- Keep parameter count under 5; use config object if more needed
- Use optional parameters with defaults (e.g., `featured = false`)
- Explicitly type return values in functions (not relying on inference)
- Example: `export function isAuthenticated(request: NextRequest): boolean`
- Use union types for conditional returns (e.g., `Promise<{ token: string; payload: JwtPayload } | null>`)
## Module Design
- Use named exports for components and utilities
- Use default export only for page routes (Next.js convention)
- Export types with `export type`
- Not used in this codebase (each import specifies exact file)
- Components import directly: `import { BlogCard } from "@/components/blog/blog-card"`
## Styling Conventions
- All styling uses React `CSSProperties` objects or component `className` with global styles
- Colors use fixed hex values (no CSS variables in application code)
- Dark theme palette:
- Example inline style objects:
- Category colors stored as Record objects with `bg` and `text` properties
## React Patterns
- Use `useState` for component-level state (no external state library)
- Use `useCallback` for memoized event handlers to avoid recreating on every render
- Use `useEffect` for side effects and data fetching
- Example: `const fetchComments = useCallback(async () => { ... }, [postId]);`
- `"use client"` directive required at top of any component using hooks or interactivity
- Server components for pages and layout when no interactivity needed
- Keep client components focused on interactive features only
- Always define prop types inline using TypeScript (not PropTypes)
- Use object destructuring in component signature for clarity
- Provide optional parameters with `?` and defaults
- Example:
- Preferred over `.then()` chains for readability
- Use in API route handlers and useCallback effects
- Always wrap in try-catch
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Server-side rendering with React Server Components for public pages
- API-driven backend with protected admin routes
- Client-side state management for blog readers and admin dashboard
- AWS DynamoDB as single source of truth for content
- AWS Bedrock for AI-assisted content generation
- Middleware-based authentication for protected routes
## Layers
- Purpose: Render UI components, handle user interactions, manage client state
- Location: `src/components/`, `src/app/*/page.tsx`
- Contains: React components (landing sections, blog UI, admin dashboard), page components
- Depends on: API routes, utility functions, type definitions
- Used by: Browser clients accessing public and authenticated pages
- Purpose: Handle HTTP requests, implement business logic, enforce authentication
- Location: `src/app/api/`
- Contains: RESTful route handlers for blog CRUD, comments, auth, and AI services
- Depends on: DynamoDB client, AWS Bedrock client, authentication utilities
- Used by: Frontend components via fetch calls, external systems (webhooks)
- Purpose: Abstract AWS services (DynamoDB, Bedrock), provide reusable interfaces
- Location: `src/lib/dynamodb.ts`, `src/lib/auth.ts`, `src/lib/admin-auth.ts`
- Contains: Database client initialization, authentication logic, type definitions
- Depends on: AWS SDK clients
- Used by: API routes
- Purpose: Persistent storage and document management
- Location: AWS DynamoDB tables
- Contains: Blog posts (`myfinancial-blog-posts`), comments (`myfinancial-comments`)
- Key structure: Posts use `PK: POST#{slug}`, global secondary index on `status-published_at-index`
## Data Flow
- Public pages: Minimal client state, primarily server-rendered with React Server Components
- Blog detail page: useState for post data, related posts, loading state, scroll progress
- Admin dashboard: useState for authentication, tab switching (posts/comments), CRUD operations
- Auth: Global `AuthProvider` wraps app with Google OAuth context, manages user sessions
## Key Abstractions
- Purpose: Type-safe representation of blog content
- Location: `src/lib/types.ts`
- Definition: id, slug, title, excerpt, content (Markdown), category, tags, author, status, reading_time, key_takeaways, published_at
- Pattern: Union type for BlogCategory (18 predefined categories), flags for draft/published status
- Purpose: Thread-based comment system
- Location: `src/lib/types.ts`
- Definition: post_id, parent_id (for nesting), author_name, content, is_admin flag, likes
- Pattern: Self-referential via parent_id for reply hierarchies
- Purpose: Abstract AWS SDK for database operations
- Location: `src/lib/dynamodb.ts`
- Pattern: Singleton initialized with environment credentials, marshalling configured to remove undefined values
- Exported functions: docClient, TABLES constant
- Purpose: Protect admin API routes
- Location: `src/lib/admin-auth.ts`
- Pattern: Request middleware checks `admin_session` cookie against SHA256(ADMIN_PASSWORD)
- Used by: All `/api/admin/*` routes via isAuthenticated() guard
## Entry Points
- Location: `src/app/layout.tsx`
- Triggers: Every page request
- Responsibilities: Set metadata (SEO, OG tags), wrap with AuthProvider (Google OAuth), render Navbar, Footer, main content, MobileStickyCTA
- Location: `src/app/page.tsx`
- Triggers: GET /
- Responsibilities: Compose landing page with Hero, DashboardPreview, Problems, Tax, HowItWorks, Pricing, Testimonials, Founder sections
- Location: `src/app/blog/page.tsx`
- Triggers: GET /blog
- Responsibilities: List all published posts, filtering by category, pagination
- Location: `src/app/blog/[slug]/page.tsx`
- Triggers: GET /blog/{slug}
- Responsibilities: Fetch and render single post with TOC, related articles, comments, reading progress indicator
- Location: `src/app/blog/admin/page.tsx`
- Triggers: GET /blog/admin
- Responsibilities: Login form, tab-based UI for posts and comments management, CRUD operations
- Location: `src/app/blog/admin/editor/page.tsx`
- Triggers: GET /blog/admin/editor (protected)
- Responsibilities: Rich editing interface for blog posts, AI assistant integration
## Error Handling
- API routes return NextResponse.json with explicit error messages and HTTP status codes
- Try-catch blocks in all async operations (database, external APIs, parsing)
- Bedrock-specific error handling: checks for `AccessDeniedException`, `ThrottlingException` to provide actionable messages
- Client-side: Shimmer loading skeletons during fetch, 404 page for missing posts, error toasts from failed mutations
- Graceful degradation: AuthProvider falls back to unauth content if Google OAuth not configured
## Cross-Cutting Concerns
- Frontend: Basic form validation in components
- Backend: Request body validation in API routes (check required fields like title, slug, password)
- Database constraints: DynamoDB schema enforces PK requirement
- Public routes: No auth required (blog index, post detail, landing pages)
- Dashboard: Google OAuth via `@react-oauth/google` library, stores session token in cookie
- Admin routes: SHA256 password hashing, session cookie validation via isAuthenticated() middleware
- Middleware redirects unauthenticated users from `/dashboard/*` to home
- Public API routes: No checks (blog/posts, blog/comments GET)
- Admin API routes: isAuthenticated() guard blocks unauthorized requests with 401 status
- Page-level: Middleware on `/dashboard/*` routes enforces session presence
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

| Skill | Description | Path |
|-------|-------------|------|
| deploy | Push to main and deploy to AWS Amplify, then monitor build status until complete | `.claude/skills/deploy/SKILL.md` |
| import-blog | Import a blog post from a URL, optionally improve with AI, and publish to Supabase | `.claude/skills/import-blog/SKILL.md` |
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
