/**
 * MyFinancial Design Tokens
 * Centralized theme configuration for the design system.
 * Import these values in components or reference via CSS custom properties in globals.css.
 */

export const tokens = {
    colors: {
        background: "#FFFFFF",
        foreground: "#0F172A",       // slate-900
        muted: "#F8FAFC",            // slate-50
        mutedForeground: "#64748B",  // slate-500
        border: "#E2E8F0",           // slate-200
        accent: "#059669",           // emerald-600
        accentDark: "#047857",       // emerald-700
        accentForeground: "#FFFFFF",
        accentLight: "#D1FAE5",      // emerald-100
        accentLighter: "#ECFDF5",    // emerald-50
        destructive: "#DC2626",      // red-600
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
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        accent: "0 10px 25px -5px rgb(5 150 105 / 0.2)",
        accentLg: "0 20px 35px -5px rgb(5 150 105 / 0.3)",
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
