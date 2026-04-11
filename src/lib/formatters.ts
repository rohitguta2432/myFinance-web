/**
 * Currency and number formatting utilities for the Indian market.
 */

/**
 * Format a number as Indian Rupees (₹).
 * @param compact - Use compact notation (e.g., ₹1.5L, ₹2.3Cr)
 */
export function formatCurrency(amount: number | null | undefined, compact = false): string {
    if (amount == null || isNaN(amount)) return "₹0";

    if (compact) {
        if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
        if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(1)}L`;
        if (amount >= 1_000) return `₹${(amount / 1_000).toFixed(1)}K`;
    }

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format a percentage value.
 */
export function formatPercentage(value: number | null | undefined, decimals = 1): string {
    if (value == null || isNaN(value)) return "0%";
    return `${Number(value).toFixed(decimals)}%`;
}

/**
 * Format an ISO date string to locale display (e.g., "12 Apr 2026").
 */
export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
