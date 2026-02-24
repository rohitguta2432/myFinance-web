/**
 * MyFinancial Design Tokens — Dark Premium
 * Centralized theme configuration for the design system.
 */

export const tokens = {
    colors: {
        background: "#0B1120",
        foreground: "#F1F5F9",        // slate-100
        muted: "#111827",             // slate-900
        mutedForeground: "#94A3B8",   // slate-400
        border: "#1E293B",            // slate-800
        accent: "#10B981",            // emerald-500
        accentDark: "#059669",        // emerald-600
        accentForeground: "#FFFFFF",
        accentLight: "rgba(16, 185, 129, 0.15)",
        accentLighter: "rgba(16, 185, 129, 0.08)",
        destructive: "#EF4444",       // red-500
        card: "rgba(15, 23, 42, 0.6)",
        cardSolid: "#0F172A",
        surface: "#111827",
        textSecondary: "#94A3B8",
        textTertiary: "#64748B",
    },

    typography: {
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        scale: {
            display: { size: "3.5rem", weight: 800, lineHeight: 1.1, tracking: "-0.025em" },
            h1: { size: "2.5rem", weight: 700, lineHeight: 1.2, tracking: "-0.02em" },
            h2: { size: "2rem", weight: 700, lineHeight: 1.25, tracking: "-0.015em" },
            h3: { size: "1.5rem", weight: 600, lineHeight: 1.3, tracking: "0" },
            h4: { size: "1.25rem", weight: 600, lineHeight: 1.4, tracking: "0" },
            bodyLg: { size: "1.125rem", weight: 400, lineHeight: 1.6, tracking: "0" },
            body: { size: "1rem", weight: 400, lineHeight: 1.6, tracking: "0" },
            bodySm: { size: "0.875rem", weight: 400, lineHeight: 1.5, tracking: "0" },
            overline: { size: "0.75rem", weight: 600, lineHeight: 1.5, tracking: "0.08em" },
        },
    },

    spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",
    },

    radius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        full: "9999px",
    },

    shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
        accent: "0 10px 25px -5px rgb(16 185 129 / 0.25)",
        accentLg: "0 20px 35px -5px rgb(16 185 129 / 0.3)",
        glow: "0 0 40px -10px rgb(16 185 129 / 0.3)",
    },

    breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
    },
} as const;

export type DesignTokens = typeof tokens;
