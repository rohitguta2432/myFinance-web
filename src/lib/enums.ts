/**
 * Shared enum maps for frontend ↔ backend value conversion.
 * These match the Spring Boot DB CHECK constraints exactly.
 */

export const CITY_TIERS = {
    METRO: "METRO",
    TIER_1: "TIER_1",
    TIER_2: "TIER_2",
    TIER_3: "TIER_3",
} as const;

export const MARITAL_STATUS = {
    SINGLE: "SINGLE",
    MARRIED: "MARRIED",
} as const;

export const RISK_TOLERANCE = {
    CONSERVATIVE: "CONSERVATIVE",
    MODERATE: "MODERATE",
    AGGRESSIVE: "AGGRESSIVE",
} as const;

export const FREQUENCY = {
    MONTHLY: "MONTHLY",
    YEARLY: "YEARLY",
    ONE_TIME: "ONE_TIME",
} as const;

export const INSURANCE_TYPE = {
    LIFE: "LIFE",
    HEALTH: "HEALTH",
} as const;

export const TAX_REGIME = {
    OLD: "OLD",
    NEW: "NEW",
} as const;

export const EMPLOYMENT_TYPE = {
    SALARIED: "SALARIED",
    SELF_EMPLOYED: "SELF_EMPLOYED",
    BUSINESS: "BUSINESS",
} as const;

export const RESIDENCY_STATUS = {
    RESIDENT: "RESIDENT",
    NRI: "NRI",
} as const;
