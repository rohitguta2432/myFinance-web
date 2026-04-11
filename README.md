# MyFinancial — Personal Finance Platform

A comprehensive personal finance platform for Indian users. Features a 6-step financial assessment wizard, personalized dashboard with health scores, AI advisory chat (Kira), and a financial blog.

**Stack**: Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zustand · TanStack Query · AWS DynamoDB · AWS Bedrock · Spring Boot Backend

---

## Quick Start

```bash
# Use Node 20+
nvm use 20

# Install dependencies
npm install

# Start development server on port 3001
npx next dev --turbopack -p 3001

# Open http://localhost:3001
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
BACKEND_URL="your-spring-boot-backend-url"
MYAPP_AWS_REGION="us-east-1"
BEDROCK_REGION="us-east-1"
BEDROCK_ACCESS_KEY_ID="your-aws-key"
BEDROCK_SECRET_ACCESS_KEY="your-aws-secret"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-sha256-hashed-password"
```

## Build & Deploy

```bash
npm run build    # Production build
npm run lint     # ESLint
```

**Deployment**: AWS Amplify (auto-deploys on push to `main`, App ID: `d2yo95fuojyxue`)

---

## Pages & Routes

### Public Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — Hero, Dashboard Preview, Problems, Tax, How It Works, Pricing, Testimonials |
| `/pricing` | Free vs Premium comparison |
| `/how-it-works` | 3-step walkthrough |
| `/privacy` | Privacy policy |
| `/disclaimer` | Financial disclaimer |
| `/blog` | Blog listing with categories and pagination |
| `/blog/[slug]` | Blog post with TOC, comments, related articles |
| `/blog/admin` | Blog admin dashboard (posts + comments management) |
| `/blog/admin/editor` | Blog post editor with AI assistant |

### Protected Pages (Google OAuth required)

| Route | Description |
|-------|-------------|
| `/assessment/step-1` | Personal Profile (age, income, risk profile) |
| `/assessment/step-2` | Cash Flow (income + expenses) |
| `/assessment/step-3` | Assets & Liabilities (net worth) |
| `/assessment/step-4` | Financial Goals |
| `/assessment/step-5` | Insurance Gap Analysis |
| `/assessment/step-6` | Tax Planning (Old vs New regime) |
| `/assessment/complete` | Assessment completion screen |
| `/dashboard` | Financial summary — health score, red flags, projections, benchmarks |
| `/dashboard/action-plan` | Priority financial actions |
| `/dashboard/insurance` | Insurance gap details |
| `/dashboard/tax` | Tax optimization details |
| `/admin` | Admin panel — user management, stats, audit logs |

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/google` | POST | Google OAuth token exchange + session |
| `/api/auth/logout` | POST | Session logout |
| `/api/auth/me` | GET | Current user profile |
| `/api/chat` | POST | Kira AI chat (proxies to backend) |
| `/api/blog/posts` | GET | Published blog posts |
| `/api/blog/comments` | POST | Add comment |
| `/api/admin/auth` | POST | Admin login |
| `/api/admin/posts` | POST | Blog CRUD |
| `/api/admin/ai-write` | POST | AI blog writing (AWS Bedrock) |
| `/api/admin/import-url` | POST | Import content from URL |
| `/api/proxy/[...path]` | POST | Proxy to Spring Boot backend |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout (fonts, Navbar, Footer)
│   ├── page.tsx                    # Landing page
│   ├── globals.css                 # Design tokens + Tailwind theme
│   ├── (protected)/
│   │   ├── layout.tsx              # Auth guard + QueryProvider + ChatWidget
│   │   ├── assessment/
│   │   │   ├── layout.tsx          # Sidebar stepper + progress bar
│   │   │   ├── step-1/ → step-6/  # 6-step assessment wizard
│   │   │   └── complete/           # Completion screen
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          # Dashboard sidebar
│   │   │   ├── page.tsx            # Summary dashboard
│   │   │   ├── action-plan/        # Action plan
│   │   │   ├── insurance/          # Insurance gap
│   │   │   └── tax/                # Tax optimization
│   │   └── admin/                  # Admin panel
│   ├── api/                        # API routes (auth, blog, chat, admin)
│   ├── blog/                       # Public blog pages
│   └── pricing/, how-it-works/, etc.
├── components/
│   ├── ai/                         # Kira chat widget
│   ├── assessment/                 # Step navigation
│   ├── auth/                       # AuthProvider, GoogleSignIn, InactivityGuard
│   ├── blog/                       # Blog cards, comments, TOC, share bar
│   ├── dashboard/                  # ScoreRing, Charts, SectionNav
│   ├── landing/                    # Landing page sections
│   ├── layout/                     # Navbar, Footer, MobileStickyCTA
│   ├── providers/                  # QueryProvider (TanStack Query)
│   └── ui/                         # Shared UI components
├── hooks/
│   ├── assessment/                 # useProfile, useFinancials, useTax, etc.
│   └── dashboard/                  # useProjection, useDashboardSummary, etc.
├── store/
│   └── useAssessmentStore.ts       # Zustand store (assessment data)
└── lib/
    ├── auth.ts                     # JWT session management
    ├── admin-auth.ts               # Admin SHA256 auth
    ├── dynamodb.ts                 # DynamoDB client
    ├── assessment-api.ts           # Assessment API helpers
    └── types.ts                    # Shared TypeScript types
```

## Key Features

- **6-Step Assessment Wizard** — Personal profile, cash flow, balance sheet, goals, insurance, tax
- **Financial Dashboard** — Health score ring, pillar scores, red flags, projections, benchmarks
- **Kira AI Chat** — Floating chat widget with personalized financial advice (Spring Boot backend)
- **Tax Optimizer** — Old vs New regime comparison with deduction tracking
- **Insurance Gap Analysis** — HLV-based life/health coverage recommendations
- **Blog Platform** — DynamoDB-backed blog with AI writing assistant (AWS Bedrock)
- **Admin Panel** — User management, stats, audit logs, CSV export

## Design System

- **Theme**: Dark premium (`#0B0F1A` bg, `#0F172A` surfaces, `#10B981` accent)
- **Font**: Bricolage Grotesque (`--font-display`)
- **Spacing**: 4px base grid
- **Styling**: Inline React `CSSProperties` + component-scoped `<style>` tags (no CSS modules)
- **Currency**: Indian formatting (₹45.7L, ₹2.1Cr)

## License

Private. Not open source.
