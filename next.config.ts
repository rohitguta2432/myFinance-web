import type { NextConfig } from "next";

const securityHeaders = [
    {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
    },
    {
        key: "X-Content-Type-Options",
        value: "nosniff",
    },
    {
        key: "X-Frame-Options",
        value: "DENY",
    },
    {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
    },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    },
    {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin-allow-popups",
    },
    {
        key: "Content-Security-Policy-Report-Only",
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com https://www.googletagmanager.com https://www.google-analytics.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data: https://fonts.gstatic.com",
            "connect-src 'self' https://accounts.google.com https://www.google-analytics.com https://myfinancial.in",
            "frame-src https://accounts.google.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join("; "),
    },
];

// Embed-only headers — partner sites iframe /embed/* routes, so we
// must NOT block framing. Empty/permissive frame-ancestors and ALLOWALL
// X-Frame-Options. Source order matters: more specific paths win, so
// /embed/(.*) is listed before /(.*) below.
const embedHeaders = [
    {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
    },
    {
        key: "X-Content-Type-Options",
        value: "nosniff",
    },
    {
        key: "X-Frame-Options",
        value: "ALLOWALL",
    },
    {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
    },
    {
        key: "Content-Security-Policy",
        value: "frame-ancestors *",
    },
];

const nextConfig: NextConfig = {
    output: "standalone",
    headers: async () => [
        {
            source: "/embed/:path*",
            headers: embedHeaders,
        },
        {
            source: "/(.*)",
            headers: securityHeaders,
        },
    ],
    redirects: async () => [
        {
            source: "/:path*",
            has: [{ type: "host", value: "www.myfinancial.in" }],
            destination: "https://myfinancial.in/:path*",
            permanent: true,
        },
        // Legacy step-N → semantic slug
        { source: "/assessment/step-1", destination: "/assessment/profile", permanent: true },
        { source: "/assessment/step-2", destination: "/assessment/cash-flow", permanent: true },
        { source: "/assessment/step-3", destination: "/assessment/assets-liabilities", permanent: true },
        { source: "/assessment/step-4", destination: "/assessment/goals", permanent: true },
        { source: "/assessment/step-5", destination: "/assessment/insurance", permanent: true },
        { source: "/assessment/step-6", destination: "/assessment/tax", permanent: true },
        // Stale Wix URLs → canonical
        { source: "/privacy-policy", destination: "/privacy", permanent: true },
        { source: "/book-online", destination: "/pricing", permanent: true },
        { source: "/blank", destination: "/", permanent: true },
        { source: "/blank-:n", destination: "/", permanent: true },
    ],
};

export default nextConfig;
