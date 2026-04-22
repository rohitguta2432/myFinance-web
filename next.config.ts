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

const nextConfig: NextConfig = {
    output: "standalone",
    headers: async () => [
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
    ],
};

export default nextConfig;
