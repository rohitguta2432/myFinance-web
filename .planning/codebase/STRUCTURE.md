# Codebase Structure

**Analysis Date:** 2026-04-11

## Directory Layout

```
myFinance-web/
├── src/
│   ├── app/                          # Next.js App Router pages and routes
│   │   ├── (public pages)
│   │   │   ├── page.tsx              # Landing homepage
│   │   │   ├── pricing/page.tsx      # Pricing page
│   │   │   ├── disclaimer/page.tsx   # Legal disclaimer
│   │   │   ├── privacy/page.tsx      # Privacy policy
│   │   │   ├── how-it-works/page.tsx # Product explanation
│   │   │   └── dashboard/            # User dashboard (authenticated)
│   │   │       ├── page.tsx
│   │   │       ├── layout.tsx
│   │   │       └── dashboard-content.tsx
│   │   ├── blog/                     # Blog feature (pages + admin)
│   │   │   ├── page.tsx              # Blog index/listing
│   │   │   ├── [slug]/page.tsx       # Single post detail page
│   │   │   ├── layout.tsx            # Blog-specific layout
│   │   │   └── admin/                # Admin-only pages
│   │   │       ├── page.tsx          # Admin dashboard (posts, comments)
│   │   │       └── editor/
│   │   │           └── page.tsx      # Post editor interface
│   │   ├── api/                      # RESTful API routes
│   │   │   ├── auth/                 # User authentication
│   │   │   │   ├── google/route.ts   # Google OAuth handler
│   │   │   │   ├── me/route.ts       # Get current user
│   │   │   │   └── logout/route.ts   # Clear session
│   │   │   ├── blog/                 # Public blog API
│   │   │   │   ├── posts/route.ts    # GET (list/single), public
│   │   │   │   └── comments/route.ts # GET/POST comments, public
│   │   │   └── admin/                # Protected admin API
│   │   │       ├── auth/route.ts     # Admin login (password)
│   │   │       ├── posts/route.ts    # GET/POST/PUT/DELETE posts
│   │   │       ├── comments/route.ts # GET/PUT/DELETE comments
│   │   │       ├── ai-write/route.ts # AI content generation
│   │   │       └── import-url/route.ts # URL scraping + import
│   │   ├── layout.tsx                # Root layout (Navbar, Footer, Auth)
│   │   ├── globals.css               # Global Tailwind styles
│   │   ├── sitemap.ts                # SEO sitemap generator
│   │   └── robots.ts                 # SEO robots.txt
│   │
│   ├── components/                   # Reusable React components
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx      # Google OAuth context wrapper
│   │   │   └── GoogleSignInButton.tsx # Sign-in button component
│   │   ├── blog/                     # Blog-specific UI
│   │   │   ├── blog-card.tsx         # Post card (preview)
│   │   │   ├── comment-section.tsx   # Threaded comments UI
│   │   │   ├── table-of-contents.tsx # Dynamic TOC from headings
│   │   │   ├── share-bar.tsx         # Social share buttons
│   │   │   ├── category-filter.tsx   # Post filtering
│   │   │   └── key-takeaways.tsx     # Highlighted takeaways
│   │   ├── layout/
│   │   │   ├── navbar.tsx            # Top navigation bar
│   │   │   ├── footer.tsx            # Footer with links
│   │   │   └── mobile-sticky-cta.tsx # Mobile call-to-action
│   │   ├── landing/                  # Landing page sections
│   │   │   ├── hero.tsx              # Hero section
│   │   │   ├── dashboard-preview.tsx # Product demo screenshot
│   │   │   ├── problems.tsx          # Pain points section
│   │   │   ├── tax.tsx               # Tax optimization feature
│   │   │   ├── how-it-works.tsx      # Feature walkthrough
│   │   │   ├── pricing.tsx           # Pricing tier cards
│   │   │   ├── testimonials.tsx      # User testimonials
│   │   │   ├── founder.tsx           # Founder bio
│   │   │   ├── final-cta.tsx         # End-of-page CTA
│   │   │   ├── scroll-reveal.tsx     # Animation wrapper
│   │   │   └── (other sections)
│   │   └── sections/
│   │       ├── hero.tsx              # Alternative hero
│   │       ├── how-it-works.tsx      # Alternative walkthrough
│   │       └── final-cta.tsx         # Alternative CTA
│   │
│   └── lib/                          # Shared utilities and types
│       ├── types.ts                  # TypeScript interfaces (BlogPost, Comment)
│       ├── dynamodb.ts               # AWS DynamoDB client singleton
│       ├── auth.ts                   # User session/JWT utilities
│       └── admin-auth.ts             # Admin authentication guard
│
├── public/                           # Static assets
│   ├── myfinancial-logo.jpeg
│   ├── myfinancial-logo-traced.svg
│   └── (other images)
│
├── .planning/                        # Documentation (auto-generated)
│   └── codebase/
│       ├── ARCHITECTURE.md
│       ├── STRUCTURE.md
│       └── (other docs)
│
├── .next/                           # Build output (generated, gitignored)
├── node_modules/                    # Dependencies (gitignored)
│
├── middleware.ts                    # Next.js middleware (auth guards)
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
├── CLAUDE.md                        # Project guidelines
└── amplify.yml                      # AWS Amplify deployment config
```

## Directory Purposes

**src/app:**
- Purpose: Next.js App Router pages, layouts, and API routes
- Contains: Page components (.tsx), API route handlers (.ts), layout files
- Structure: File-based routing where folder name = URL segment, [dynamic] = parameters
- Key files: page.tsx (renders route), layout.tsx (wraps children), route.ts (API handler)

**src/components:**
- Purpose: Reusable React components organized by feature/domain
- Contains: Client and server components, shared UI building blocks
- Pattern: One component per file, or grouped in subdirectory for related components
- Naming: kebab-case filenames, PascalCase exported component names

**src/lib:**
- Purpose: Shared utilities, type definitions, service abstractions
- Contains: Types (interfaces, unions), AWS client initialization, authentication logic
- Pattern: Singleton services (DynamoDB client), utility functions, constants
- No UI components — only pure functions and configurations

**public:**
- Purpose: Static assets served directly by Next.js (images, logos, fonts)
- Contains: Logo variants (JPEG, SVG), brand images, favicon
- Served at: / root path (e.g., /myfinancial-logo.jpeg)

## Key File Locations

**Entry Points:**

- `src/app/page.tsx` — Landing homepage, composes all hero/CTA sections
- `src/app/layout.tsx` — Root layout, sets SEO metadata, wraps AuthProvider
- `src/app/blog/page.tsx` — Blog listing, filters by category
- `src/app/blog/[slug]/page.tsx` — Individual post detail with comments, TOC, related
- `src/app/blog/admin/page.tsx` — Admin dashboard (password-protected), posts + comments tabs
- `src/app/blog/admin/editor/page.tsx` — Rich post editor with AI assistance

**Configuration:**

- `tsconfig.json` — TypeScript settings, path alias `@/*` → `./src/*`
- `next.config.ts` — Next.js build config (standalone output, CORS headers)
- `middleware.ts` — Route protection, redirects `/dashboard/*` unauthenticated users to `/`
- `package.json` — Dependencies (React 19, Next.js 15, Tailwind 4, AWS SDK v3)

**Core Logic:**

- `src/lib/dynamodb.ts` — DynamoDB client factory, exports TABLES constant
- `src/lib/admin-auth.ts` — isAuthenticated() guard, checks admin_session cookie
- `src/lib/auth.ts` — getSession() utility, decodes JWT from session cookie
- `src/lib/types.ts` — BlogPost, Comment, BlogCategory types and constants

**API Routes (Blog CRUD):**

- `src/app/api/blog/posts/route.ts` — GET list (with pagination, filtering), GET single (by slug)
- `src/app/api/admin/posts/route.ts` — GET (all), POST (create), PUT (update), DELETE
- `src/app/api/admin/ai-write/route.ts` — POST with action (generate, improve, summarize, takeaways)

**API Routes (Auth):**

- `src/app/api/auth/google/route.ts` — OAuth credential exchange, session setup
- `src/app/api/auth/me/route.ts` — GET current user (requires session)
- `src/app/api/auth/logout/route.ts` — Clear session cookie

**API Routes (Comments):**

- `src/app/api/blog/comments/route.ts` — GET list, POST new comment
- `src/app/api/admin/comments/route.ts` — GET/PUT/DELETE (admin only)

## Naming Conventions

**Files:**

- Pages: `page.tsx` (always named page, in folder matching URL segment)
- API routes: `route.ts` (one per HTTP method or combined in single file)
- Components: `kebab-case.tsx` (e.g., `comment-section.tsx`, `blog-card.tsx`)
- Utilities/types: `kebab-case.ts` (e.g., `admin-auth.ts`, `dynamodb.ts`)
- Styles: Global CSS in `globals.css`, inline styles in components or `<style>` tags

**Directories:**

- Dynamic routes: `[param]` or `[...slug]` (URL segments become params)
- Layout scopes: `layout.tsx` in folder applies to all children
- Grouped (non-routed): `(groupname)` syntax (parentheses are invisible to routing)
- API features: `/api/{domain}/{resource}/route.ts` (e.g., `/api/blog/posts/route.ts`)

**Components:**

- Page components: PascalCase, exported as default (e.g., `export default function HomePage()`)
- Reusable components: PascalCase, exported as named (e.g., `export function BlogCard()`)
- Props interfaces: `{ComponentName}Props` (e.g., `BlogCardProps`)

**Variables & Functions:**

- Constants: UPPER_SNAKE_CASE (e.g., `TABLES`, `BLOG_CATEGORIES`)
- Types: PascalCase (e.g., `BlogPost`, `BlogCategory`)
- Functions: camelCase (e.g., `getSession()`, `isAuthenticated()`)
- Hooks (custom): camelCase starting with "use" (e.g., `usePost()`, `useComments()`)

## Where to Add New Code

**New Feature (e.g., Newsletter, Search):**

- Primary code: `src/app/api/feature-name/route.ts` (API endpoint)
- Frontend: `src/app/feature-name/page.tsx` (page) + `src/components/feature/` (UI)
- Types: Add to `src/lib/types.ts` if global, or inline in component if scoped
- Styling: Inline styles or `<style>` tag in component (no CSS modules)

**New Component/Module:**

- Implementation: `src/components/{feature-name}/{component-name}.tsx`
- Multiple related: Create feature folder, e.g., `src/components/search/` containing `search-box.tsx`, `search-results.tsx`
- Testing: Create `.test.tsx` in same directory (if tests are added)

**Utilities:**

- Shared helpers: `src/lib/utils.ts` (new file if big, or extend existing file)
- AWS integrations: `src/lib/{service-name}.ts` (e.g., `s3.ts`, `bedrock.ts`)
- Type definitions: Always in `src/lib/types.ts`

**API Endpoints:**

- Public routes: `src/app/api/{domain}/{resource}/route.ts` with no auth guard
- Protected routes: `src/app/api/admin/{resource}/route.ts` with `isAuthenticated()` check at top of handler
- Middleware guards: Update `middleware.ts` if new protected page routes needed

## Special Directories

**src/app:**
- Purpose: Next.js file-based routing (every folder/file structure = URL path)
- Generated: No (hand-written)
- Committed: Yes

**.next:**
- Purpose: Build output and cached assets
- Generated: Yes (created by `npm run build`)
- Committed: No (gitignored)

**public:**
- Purpose: Static assets (served directly without processing)
- Generated: No (hand-maintained)
- Committed: Yes

**node_modules:**
- Purpose: Dependency files
- Generated: Yes (by npm install)
- Committed: No (gitignored)

---

*Structure analysis: 2026-04-11*
