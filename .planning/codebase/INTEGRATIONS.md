# External Integrations

**Analysis Date:** 2026-04-11

## APIs & External Services

**AWS Bedrock (AI Content Generation):**
- Service: AWS Bedrock with Amazon Nova Pro model
- What it's used for: Blog post generation, improvement, summarization, and key takeaway extraction
- SDK/Client: `@aws-sdk/client-bedrock-runtime@3.1000.0`
- Model: `us.amazon.nova-pro-v1:0`
- Auth: `BEDROCK_ACCESS_KEY_ID`, `BEDROCK_SECRET_ACCESS_KEY`
- Implementation: `src/app/api/admin/ai-write/route.ts`
- API Actions:
  - `generate` - Create new blog posts (4096 tokens max, temp: 0.7)
  - `improve` - Polish existing content (4096 tokens max, temp: 0.7)
  - `summarize` - Create excerpt previews (512 tokens max, temp: 0.3)
  - `takeaways` - Extract 3-5 key points (512 tokens max, temp: 0.3)
- System Prompt: Specialized for Indian personal finance content (₹, Lakh, Crore, PPF, EPF, NPS, ELSS, 80C tax codes)

**Google OAuth 2.0 (User Authentication):**
- Service: Google OAuth 2.0 for user identity
- What it's used for: User login via Google accounts
- SDK/Client: `@react-oauth/google@0.13.5`
- Auth: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Token exchange endpoint: `https://oauth2.googleapis.com/token`
- Implementation: 
  - Frontend: `src/components/auth/AuthProvider.tsx`
  - Backend proxy: `src/app/api/auth/google/route.ts`
- Flow:
  1. Frontend requests authorization code from Google
  2. Frontend sends code to backend proxy at `/api/auth/google`
  3. Backend exchanges code for ID token
  4. Backend proxies request to custom backend at `BACKEND_URL/api/v1/auth/google`
  5. Backend returns user profile and session token
  6. Session token stored in httpOnly cookie (`session`)

**Custom Backend Authentication:**
- Service: Backend API for token validation and user profile
- What it's used for: User session management and profile data
- Endpoint: `BACKEND_URL/api/v1/auth/google`
- Auth: Expects JSON body with `credential` (Google ID token)
- Response: `{ token: string, user: { id, email, name, pictureUrl } }`
- Implementation: `src/app/api/auth/google/route.ts`

**URL Content Import Service (Internal):**
- Service: Combines Mozilla Readability, JSDOM, and Turndown for URL scraping
- What it's used for: Import blog content from external URLs, convert HTML to Markdown
- Tools:
  - `@mozilla/readability@0.6.0` - Article extraction (Firefox Reader View engine)
  - `jsdom@29.0.2` - Server-side DOM parsing
  - `turndown@7.2.4` - HTML to Markdown conversion
  - `turndown-plugin-gfm@1.0.2` - GitHub Flavored Markdown support
- Implementation: `src/app/api/admin/import-url/route.ts`
- Features:
  - Fetches HTML with Mozilla user agent (30s timeout)
  - Extracts article with Readability parser
  - Parses OpenGraph metadata: `og:title`, `og:description`, `og:image`
  - Converts article HTML to clean Markdown with Turndown + GFM
  - Returns: title, excerpt (300 char), markdown content, cover image, source URL

## Data Storage

**Databases:**
- Provider: AWS DynamoDB
  - Region: `MYAPP_AWS_REGION` (default: us-east-1)
  - Tables:
    - `myfinancial-blog-posts` - Blog post data
    - `myfinancial-comments` - User comments on blog posts
  - Client: `@aws-sdk/lib-dynamodb@3.1025.0` (Document Client)
  - Credentials: Shared with Bedrock (`BEDROCK_ACCESS_KEY_ID`, `BEDROCK_SECRET_ACCESS_KEY`)
  - Fallback: Can use separate `DYNAMODB_ACCESS_KEY_ID`/`DYNAMODB_SECRET_ACCESS_KEY` if needed
  - Implementation: `src/lib/dynamodb.ts` exports `docClient` and `TABLES` constants
  - Query operations: Used in:
    - `src/app/api/blog/posts/route.ts` - List and get blog posts
    - `src/app/api/blog/comments/route.ts` - List and create comments
    - `src/app/admin/posts/route.ts` - Admin CRUD for posts
    - `src/app/admin/comments/route.ts` - Admin comment moderation
    - `src/app/sitemap.ts` - SEO sitemap generation

**File Storage:**
- Local filesystem only - No external cloud storage configured
- Cover images: References stored in DynamoDB, external URLs supported

**Caching:**
- Not configured - No external caching layer (Redis, Memcached, etc.)

## Authentication & Identity

**Auth Providers:**
- Google OAuth 2.0 - User login
- Custom Backend - Session token issuance and validation
- Admin Password - SHA256 hash-based admin route protection

**Session Management:**
- Implementation: `src/lib/auth.ts`
- Cookie-based with httpOnly for security
- JWT tokens stored in `session` cookie (7-day expiry)
- User profile stored in `user_profile` cookie (non-httpOnly, accessible to frontend)
- Admin sessions: `admin_session` cookie with SHA256(password) hash

**Token Flow:**
1. User authenticates via Google OAuth
2. Backend issues JWT token
3. Token stored in httpOnly `session` cookie
4. Next.js middleware can access token from cookies
5. API routes verify token before processing user requests

## Monitoring & Observability

**Error Tracking:**
- Not configured - No third-party error tracking service
- Bedrock-specific error handling:
  - `AccessDeniedException` - Model access not enabled in AWS console
  - `ThrottlingException` - Rate limit exceeded

**Logs:**
- Console logging via `console.error()` in API routes
- Amplify captures stdout/stderr during deployment and runtime

## CI/CD & Deployment

**Hosting:**
- AWS Amplify Hosting (managed platform)
  - App ID: d2yo95fuojyxue
  - Auto-deploys from `main` branch on push
  - Build phase: `npm ci && npm run build`
  - Artifacts: `.next/` directory (standalone output)

**CI Pipeline:**
- No explicit CI service configured
- Amplify handles build and deployment automatically
- Build config: `amplify.yml` in repository root

**Build Process:**
- Pre-build: 
  - Install dependencies: `npm ci`
  - Build environment variables into `.env.production` from Amplify console vars
  - Filtered vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, ADMIN_USERNAME, ADMIN_PASSWORD, BEDROCK_REGION, BEDROCK_ACCESS_KEY_ID, BEDROCK_SECRET_ACCESS_KEY
- Build: `npm run build`
- Cache: `node_modules/**/*` and `.next/cache/**/*`

## Environment Configuration

**Required Environment Variables:**

**AWS Integration:**
- `MYAPP_AWS_REGION` - DynamoDB region (default: us-east-1)
- `BEDROCK_REGION` - Bedrock region (default: us-east-1)
- `BEDROCK_ACCESS_KEY_ID` - AWS access key for Bedrock/DynamoDB
- `BEDROCK_SECRET_ACCESS_KEY` - AWS secret key for Bedrock/DynamoDB

**Authentication:**
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID (public)
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret (server-only)
- `BACKEND_URL` - Custom backend API base URL
- `ADMIN_USERNAME` - Admin login username (default: "admin")
- `ADMIN_PASSWORD` - Admin login password

**Secrets Location:**
- Development: `.env.local` (git-ignored)
- Production: AWS Amplify Console environment variables
- Secrets are NOT stored in repository

**Note:** `SUPABASE_*` variables appear in Amplify config but are legacy/unused (referenced in amplify.yml but not in active code)

## Webhooks & Callbacks

**Incoming:**
- `/api/auth/google` - POST endpoint for Google OAuth callback processing
- `/api/admin/ai-write` - POST endpoint for AI content generation requests
- `/api/admin/import-url` - POST endpoint for URL content import
- `/api/admin/posts` - POST endpoint for blog post CRUD
- `/api/admin/comments` - POST endpoint for comment moderation
- `/api/admin/auth` - POST endpoint for admin authentication

**Outgoing:**
- Calls to `https://oauth2.googleapis.com/token` - Google OAuth token exchange
- Calls to `BACKEND_URL/api/v1/auth/google` - Custom backend auth proxy
- Calls to arbitrary URLs for content import (via `src/app/api/admin/import-url/route.ts`)

**Admin Route Protection:**
- All admin routes (*/admin/*) protected by `isAuthenticated()` middleware
- Verification: `src/lib/admin-auth.ts` checks `admin_session` cookie SHA256 hash
- Route: `src/app/api/admin/auth/route.ts` handles admin login

---

*Integration audit: 2026-04-11*
