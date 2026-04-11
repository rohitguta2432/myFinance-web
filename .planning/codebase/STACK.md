# Technology Stack

**Analysis Date:** 2026-04-11

## Languages

**Primary:**
- TypeScript 5.7.3 - All source code in `src/`
- JavaScript (JSX/TSX) - React components and Next.js pages

**Secondary:**
- HTML/CSS via Tailwind CSS 4

## Runtime

**Environment:**
- Node.js 20+ (per CLAUDE.md instructions: `nvm use 20`)

**Package Manager:**
- npm (lockfileVersion 3)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 15.2.0 - App Router with Turbopack (`npm run dev`)
  - Output mode: `standalone` for AWS Amplify deployment
  - Location: `src/app/`

**UI/Components:**
- React 19.0.0 - Component library
- Radix UI - Headless components (referenced in CLAUDE.md, not explicitly in package.json)
- Lucide React 0.475.0 - Icon library
- Tailwind CSS 4.0.0 - Utility-first styling via postcss

**Content Rendering:**
- Marked 17.0.3 - Markdown to HTML rendering (`src/app/blog/[slug]/page.tsx`)
- Cheerio - HTML parsing for URL scraping (mentioned in CLAUDE.md, not found in dependencies - likely bundled or implicit)

**Content Conversion:**
- Turndown 7.2.4 - HTML to Markdown conversion
- Turndown Plugin GFM 1.0.2 - GitHub Flavored Markdown support for Turndown
- Mozilla Readability 0.6.0 - Article extraction (used in `src/app/api/admin/import-url/route.ts`)
- JSDOM 29.0.2 - DOM implementation for server-side HTML parsing

**Authentication:**
- @react-oauth/google 0.13.5 - Google OAuth integration for frontend
- Custom JWT-based session handling via cookies

## Key Dependencies

**Critical:**
- @aws-sdk/client-bedrock-runtime 3.1000.0 - AWS Bedrock AI service integration
  - Model: Amazon Nova Pro (`us.amazon.nova-pro-v1:0`)
  - Used in: `src/app/api/admin/ai-write/route.ts`

- @aws-sdk/client-dynamodb 3.1025.0 - DynamoDB database client
  - Credentials: BEDROCK_ACCESS_KEY_ID, BEDROCK_SECRET_ACCESS_KEY (shared credentials)

- @aws-sdk/lib-dynamodb 3.1025.0 - DynamoDB Document Client for simplified API
  - Wrapper around client-dynamodb for object-based queries

**Infrastructure:**
- @types/node 22.13.4 - Node.js type definitions
- @types/react 19.0.8, @types/react-dom 19.0.3 - React type definitions
- @types/jsdom 28.0.1 - JSDOM type definitions
- @types/turndown 5.0.6 - Turndown type definitions

## Configuration

**Build Configuration:**
- `tsconfig.json` - TypeScript compiler options
  - Target: ES2017
  - Module resolution: bundler
  - Path alias: `@/*` → `./src/*`

- `next.config.ts` - Next.js configuration
  - Standalone output mode for containerization
  - CORS header: `Cross-Origin-Opener-Policy: same-origin-allow-popups` (for OAuth)

- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS 4

**Environment Configuration:**
- `.env.local` present (local development)
- Environment variables build into `.env.production` during Amplify build phase

**Linting:**
- ESLint 9 - Code linting
- ESLint Config Next 15.2.0 - Next.js-specific rules

## Environment Variables Required

**AWS Integration:**
- `MYAPP_AWS_REGION` - AWS region for DynamoDB (default: us-east-1)
- `BEDROCK_REGION` - AWS region for Bedrock (default: us-east-1)
- `BEDROCK_ACCESS_KEY_ID` - AWS credentials for Bedrock
- `BEDROCK_SECRET_ACCESS_KEY` - AWS credentials for Bedrock
- `DYNAMODB_ACCESS_KEY_ID` - Falls back to BEDROCK_ACCESS_KEY_ID if not set
- `DYNAMODB_SECRET_ACCESS_KEY` - Falls back to BEDROCK_SECRET_ACCESS_KEY if not set

**Authentication:**
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID (public)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (server-only)
- `BACKEND_URL` - Backend API URL for Google OAuth token exchange
- `ADMIN_USERNAME` - Admin login username (default: "admin")
- `ADMIN_PASSWORD` - Admin login password (hashed with SHA256)

**Node Environment:**
- `NODE_ENV` - "development" or "production" (affects cookie security)

## Platform Requirements

**Development:**
- Node.js 20+ (via nvm: `nvm use 20`)
- npm for package management
- AWS account with:
  - DynamoDB tables: `myfinancial-blog-posts`, `myfinancial-comments`
  - Bedrock access with Amazon Nova Pro model enabled
  - IAM credentials for SDK access

**Production:**
- AWS Amplify Hosting (auto-deploys from `main` branch)
- App ID: d2yo95fuojyxue
- Requires environment variables in Amplify console:
  - All AWS credentials
  - Google OAuth credentials
  - Admin credentials
  - Backend URL for auth proxying

## Build Output

- Next.js standalone build: `.next/` directory
- Artifacts for Amplify: `.next/` baseDirectory with all files
- Cache paths: `node_modules/**/*` and `.next/cache/**/*`

---

*Stack analysis: 2026-04-11*
