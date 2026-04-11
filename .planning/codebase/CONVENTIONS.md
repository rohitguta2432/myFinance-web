# Coding Conventions

**Analysis Date:** 2026-04-11

## Naming Patterns

**Files:**
- Components: `kebab-case.tsx` (e.g., `blog-card.tsx`, `comment-section.tsx`, `auth-provider.tsx`)
- Pages: `kebab-case.tsx` (e.g., `page.tsx` in route directories)
- Utilities/services: `kebab-case.ts` (e.g., `admin-auth.ts`, `dynamodb.ts`)
- Type definitions: `types.ts` (central file with all major types and interfaces)

**Functions:**
- PascalCase for React components (both function declarations and exported functions)
  - Examples: `HomePage()`, `BlogCard()`, `CommentSection()`, `AuthProvider()`
- camelCase for utility functions and non-component functions
  - Examples: `isAuthenticated()`, `decodeJwtPayload()`, `timeAgo()`, `fetchComments()`
- Prefix boolean/check functions with `is` or `handle` for event handlers
  - Examples: `isAuthenticated()`, `handleSubmit()`, `handleLogin()`, `handleDeletePost()`

**Variables:**
- camelCase for all local and state variables
  - Examples: `loading`, `comments`, `setComments`, `postId`, `loginError`, `selectedTab`
- camelCase for function parameters
  - Examples: `postId`, `featured`, `isReply`, `parentId`
- UPPERCASE_SNAKE_CASE for constants and environment variables
  - Examples: `TABLES`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `DYNAMODB_ACCESS_KEY_ID`

**Types:**
- PascalCase for type and interface names
  - Examples: `BlogPost`, `Comment`, `User`, `JwtPayload`
- Use `type` for union types and simple aliases
  - Example: `type BlogCategory = "Tax Saving" | "Investing" | ...`
- Use `interface` for object shapes with required properties
  - Examples: `interface BlogPost { ... }`, `interface Comment { ... }`

**CSS/Styles:**
- snake_case for CSS custom property names (when used)
- Inline CSSProperties objects with camelCase keys (React convention)

## Code Style

**Formatting:**
- No explicit formatter configured (ESLint only for linting)
- Default Next.js/TypeScript formatting conventions apply
- Indentation: 4 spaces (inferred from code samples)

**Linting:**
- Tool: ESLint 9 with Next.js config (`eslint-config-next`)
- Command: `npm run lint`
- No custom .eslintrc config file (uses Next.js defaults)

**Line Length:**
- No strict limit enforced, but aim for readability (most lines under 100 characters)

**Imports:**
- Use ES6 `import` statements exclusively
- No CommonJS `require()` in source code
- Use TypeScript `type` keyword for importing types:
  - Example: `import type { BlogPost } from "@/lib/types"`

## Import Organization

**Order:**
1. External/third-party imports from `node_modules`
   - Example: `import { useState, useEffect } from "react"`
   - Example: `import Link from "next/link"`
   - Example: `import { GetCommand } from "@aws-sdk/lib-dynamodb"`
2. Type imports (marked with `type` keyword)
   - Example: `import type { BlogPost } from "@/lib/types"`
3. Internal absolute imports using `@/` alias
   - Example: `import { isAuthenticated } from "@/lib/admin-auth"`
4. Relative imports (rarely used)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- All internal imports use `@/` absolute path style, never relative paths
- Examples:
  - `@/lib/types` for type definitions
  - `@/lib/dynamodb` for database utilities
  - `@/lib/admin-auth` for authentication
  - `@/components/blog/blog-card` for components

## Error Handling

**Patterns:**
- Use try-catch blocks in async functions and API routes
- Check error type with `error instanceof Error` to access `.message`
- Log errors with `console.error()` including context (e.g., "Admin posts GET error:")
- Return appropriate HTTP status codes from API routes (401 for auth, 400 for validation, 422 for unprocessable, 500 for server errors)
- Provide user-friendly error messages in API responses
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

**Validation:**
- Type-check input variables before use (e.g., `typeof url !== "string"`)
- Return 400 status with error message for invalid input
- Example from `src/app/api/admin/import-url/route.ts`:
  ```typescript
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }
  ```

## Logging

**Framework:** `console` object (no logging library)

**Patterns:**
- Use `console.error()` for errors in try-catch blocks
- Include context/operation name in error logs (e.g., "Admin posts GET error:", "Blog posts API error:")
- Use `console.error()` for client-side issues (e.g., missing env vars)
- No console logging in components for production code (only error cases)
- Example: `console.error("Admin posts GET error:", error);`

## Comments

**When to Comment:**
- Document non-obvious algorithmic logic
- Explain business rules (e.g., why reading time is calculated as ~200 words/min)
- Mark sections in long functions (e.g., `// Extract metadata`, `// Build title`)
- Do not comment obvious code (e.g., `// Set loading to true` above `setLoading(true)`)

**JSDoc/TSDoc:**
- Used minimally - only for utility functions with significant complexity
- Single-line doc comments for functions when needed
- Example from `src/lib/admin-auth.ts`:
  ```typescript
  /**
   * Check if the incoming request has a valid admin session cookie.
   */
  export function isAuthenticated(request: NextRequest): boolean {
  ```

## Function Design

**Size:**
- Prefer small, focused functions (single responsibility)
- Component functions typically 50-300 lines (including JSX)
- Utility functions typically under 50 lines
- If function exceeds 150 lines of logic, extract sub-functions

**Parameters:**
- Use object destructuring for multiple parameters in components
  - Example: `export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean })`
- Keep parameter count under 5; use config object if more needed
- Use optional parameters with defaults (e.g., `featured = false`)

**Return Values:**
- Explicitly type return values in functions (not relying on inference)
- Example: `export function isAuthenticated(request: NextRequest): boolean`
- Use union types for conditional returns (e.g., `Promise<{ token: string; payload: JwtPayload } | null>`)

## Module Design

**Exports:**
- Use named exports for components and utilities
  - Example: `export function BlogCard(...) { }`
  - Example: `export const TABLES = { ... }`
- Use default export only for page routes (Next.js convention)
  - Example: `export default function HomePage() { }`
- Export types with `export type`
  - Example: `export type BlogCategory = ...`

**Barrel Files:**
- Not used in this codebase (each import specifies exact file)
- Components import directly: `import { BlogCard } from "@/components/blog/blog-card"`

## Styling Conventions

**Pattern:** Inline styles only - no CSS modules or Tailwind utility classes

- All styling uses React `CSSProperties` objects or component `className` with global styles
- Colors use fixed hex values (no CSS variables in application code)
- Dark theme palette:
  - Backgrounds: `#0B0F1A` (darkest), `#0F172A` (dark), `#1E293B` (medium-dark)
  - Text: `#F1F5F9` (primary), `#CBD5E1` (secondary), `#94A3B8` (tertiary), `#64748B` (dim)
  - Accents: `#10B981` (green/success), `#3B82F6` (blue), `#EF4444` (red), `#F59E0B` (amber)
- Example inline style objects:
  ```typescript
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid #1E293B",
    background: "rgba(15, 23, 42, 0.6)",
    color: "#F1F5F9",
  };
  ```
- Category colors stored as Record objects with `bg` and `text` properties
  - Example from `src/components/blog/blog-card.tsx`:
    ```typescript
    const categoryColors: Record<string, { bg: string; text: string }> = {
      "Tax Saving": { bg: "rgba(16, 185, 129, 0.15)", text: "#10B981" },
      // ...
    };
    ```

## React Patterns

**State Management:**
- Use `useState` for component-level state (no external state library)
- Use `useCallback` for memoized event handlers to avoid recreating on every render
- Use `useEffect` for side effects and data fetching
- Example: `const fetchComments = useCallback(async () => { ... }, [postId]);`

**Client vs Server Components:**
- `"use client"` directive required at top of any component using hooks or interactivity
- Server components for pages and layout when no interactivity needed
- Keep client components focused on interactive features only

**Type Props:**
- Always define prop types inline using TypeScript (not PropTypes)
- Use object destructuring in component signature for clarity
- Provide optional parameters with `?` and defaults
- Example:
  ```typescript
  export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean })
  ```

**Async/await:**
- Preferred over `.then()` chains for readability
- Use in API route handlers and useCallback effects
- Always wrap in try-catch

---

*Convention analysis: 2026-04-11*
