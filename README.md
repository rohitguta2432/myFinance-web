# MyFinancial — Marketing Website

A premium, privacy-first marketing website for **MyFinancial**, an Indian personal finance assessment tool.

**Stack**: Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Lucide Icons

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Build & Deploy

### Production Build

```bash
npm run build
npm start
```

### Static Export

All pages are statically generated at build time. To export a fully static site:

1. Add `output: 'export'` to `next.config.ts`:
   ```ts
   const nextConfig: NextConfig = { output: 'export' };
   ```
2. Run `npm run build` — the static files will be in the `out/` directory.
3. Deploy the `out/` folder to any static hosting (Netlify, Cloudflare Pages, S3, etc.).

### Deploy to Vercel (Recommended)

1. Push the repo to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Next.js — no configuration needed.
4. Deploy. Done.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — Hero, Outcomes, How it Works, Privacy, Pricing, FD Calculator, Insights, FAQ, CTA |
| `/how-it-works` | Expanded 3-step walkthrough |
| `/pricing` | Free vs Premium comparison with detailed feature table |
| `/privacy` | Privacy policy — local-only storage, no-server architecture |
| `/disclaimer` | Financial disclaimer — not financial advice |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Inter font, Navbar, Footer)
│   ├── page.tsx                # Home — assembles all sections
│   ├── globals.css             # Design tokens + Tailwind theme
│   ├── sitemap.ts              # Dynamic sitemap.xml
│   ├── robots.ts               # robots.txt
│   ├── how-it-works/page.tsx
│   ├── pricing/page.tsx
│   ├── privacy/page.tsx
│   └── disclaimer/page.tsx
├── components/
│   ├── layout/
│   │   ├── navbar.tsx          # Sticky header + mobile hamburger
│   │   ├── footer.tsx          # 4-column footer
│   │   └── mobile-sticky-cta.tsx # Mobile-only bottom CTA
│   └── sections/
│       ├── hero.tsx            # Hero + trust bar
│       ├── outcomes.tsx        # 5 outcome tiles
│       ├── how-it-works.tsx    # 3-step vertical flow
│       ├── privacy-first.tsx   # Privacy section with feature grid
│       ├── pricing-table.tsx   # Free vs Premium table
│       ├── fd-calculator.tsx   # FD calculator (UI only)
│       ├── sample-insights.tsx # 3 example insight cards
│       ├── faq.tsx             # Accordion FAQ
│       └── final-cta.tsx       # Closing CTA block
└── lib/
    ├── utils.ts                # cn() classname merge utility
    └── tokens.ts               # Design token constants
```

## Design System

- **Accent**: Emerald-600 (`#059669`) — single accent color throughout
- **Font**: Inter (Google Fonts via `next/font`)
- **Spacing**: 4px base grid (xs=4, sm=8, md=16, lg=24, xl=32, 2xl=48, 3xl=64, 4xl=96)
- **Style**: Clean white space, high-contrast typography, no stock photos
- **Currency**: Indian formatting (₹45.7L, ₹2.1Cr)

See `src/lib/tokens.ts` for the complete token reference.

## License

Private. Not open source.
