// calculator-utils.ts — Pure financial math utilities for calculator pages.
// No "use client" — can be imported by both server and client components.

// ─── Indian Number Formatting ────────────────────────────────────────────────

/**
 * Formats a number using Indian grouping (e.g., ₹12,34,567).
 */
export function formatIndianCurrency(n: number): string {
    if (isNaN(n) || !isFinite(n)) return "₹0";
    const rounded = Math.round(n);
    const s = rounded.toString();
    const lastThree = s.slice(-3);
    const rest = s.slice(0, -3);
    const grouped = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree : lastThree;
    return "₹" + grouped;
}

/**
 * Formats a number as Lakhs or Crores with 2 decimal precision.
 *   < 1 Lakh (100000): plain "₹X,XXX"
 *   1 Lakh to 99.99 Lakhs: "₹X.XX Lakhs"
 *   >= 1 Crore (10000000): "₹X.XX Cr"
 */
export function formatLakhsCrores(n: number): string {
    if (isNaN(n) || !isFinite(n)) return "₹0";
    const abs = Math.abs(n);
    if (abs >= 10_000_000) {
        return "₹" + (n / 10_000_000).toFixed(2) + " Cr";
    }
    if (abs >= 100_000) {
        return "₹" + (n / 100_000).toFixed(2) + " Lakhs";
    }
    return formatIndianCurrency(n);
}

// ─── Financial Formulas ──────────────────────────────────────────────────────

/**
 * SIP future value.
 * FV = M × [((1 + r)^n − 1) / r] × (1 + r)
 * r = annualRate / 12 / 100, n = years × 12
 */
export function calcSIP(monthlyAmount: number, annualRate: number, years: number): number {
    const r = annualRate / 12 / 100;
    const n = years * 12;
    if (r === 0) return monthlyAmount * n;
    return monthlyAmount * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}

/**
 * Lumpsum future value.
 * FV = P × (1 + r)^n
 * r = annualRate / 100, n = years
 */
export function calcLumpsum(principal: number, annualRate: number, years: number): number {
    const r = annualRate / 100;
    return principal * Math.pow(1 + r, years);
}

/**
 * EMI calculation.
 * EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
 * r = annualRate / 12 / 100, n = tenureMonths
 */
export function calcEMI(principal: number, annualRate: number, tenureMonths: number): number {
    const r = annualRate / 12 / 100;
    if (r === 0) return principal / tenureMonths;
    const powered = Math.pow(1 + r, tenureMonths);
    return (principal * r * powered) / (powered - 1);
}

/**
 * FD maturity value.
 * FV = P × (1 + r / freq)^(freq × years)
 * freq = compounding frequency (4 = quarterly, 2 = half-yearly, 1 = annual)
 */
export function calcFD(principal: number, annualRate: number, years: number, freq: number = 4): number {
    const r = annualRate / 100;
    return principal * Math.pow(1 + r / freq, freq * years);
}

/**
 * PPF maturity value after given years (default 15) with 7.1% annual rate.
 * Yearly deposit is made at the start of each year.
 * Years capped to 40 (Rule T-07-03 — prevent DoS via infinite loop).
 */
export function calcPPF(yearlyDeposit: number, years: number = 15): number {
    const cappedYears = Math.min(Math.max(0, years), 40);
    const rate = 0.071; // 7.1% p.a.
    let corpus = 0;
    for (let y = 0; y < cappedYears; y++) {
        corpus = (corpus + Math.max(0, yearlyDeposit)) * (1 + rate);
    }
    return corpus;
}

/**
 * HRA tax exemption — minimum of three limits:
 *   1. Actual HRA received
 *   2. Rent paid − 10% of basic salary
 *   3. 50% of basic salary (metro) or 40% (non-metro)
 */
export function calcHRA(basicSalary: number, hra: number, rentPaid: number, isMetro: boolean): number {
    const limit1 = Math.max(0, hra);
    const limit2 = Math.max(0, rentPaid - 0.1 * basicSalary);
    const limit3 = basicSalary * (isMetro ? 0.5 : 0.4);
    return Math.min(limit1, limit2, limit3);
}

/**
 * NPS corpus and monthly pension.
 * Corpus: SIP formula at 10% p.a. for (retirementAge - currentAge) years.
 * Monthly pension: 40% of corpus invested in annuity at 6% p.a.
 */
export function calcNPS(
    monthlyContribution: number,
    currentAge: number,
    retirementAge: number = 60
): { corpus: number; monthlyPension: number } {
    const years = Math.max(0, retirementAge - currentAge);
    const corpus = calcSIP(monthlyContribution, 10, years);
    // 40% corpus goes to annuity (mandatory), 6% annuity rate
    const annuityCorpus = corpus * 0.4;
    const monthlyPension = (annuityCorpus * 0.06) / 12;
    return { corpus, monthlyPension };
}

/**
 * Retirement required corpus.
 * Step 1: Future monthly expenses adjusted for inflation over yearsToRetire.
 * Step 2: Required corpus = inflated annual expenses / 0.04 (4% safe withdrawal).
 */
export function calcRetirement(
    monthlyExpenses: number,
    currentAge: number,
    retirementAge: number,
    inflationRate: number = 6
): number {
    const yearsToRetire = Math.max(0, retirementAge - currentAge);
    const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetire);
    const annualExpenses = futureMonthlyExpenses * 12;
    return annualExpenses / 0.04; // 4% safe withdrawal rate
}

/**
 * SWP sustainability — how many years the corpus lasts at a monthly withdrawal
 * given an annual growth rate on the remaining corpus.
 * Returns years capped at 50.
 */
export function calcSWP(corpus: number, monthlyWithdrawal: number, annualGrowthRate: number): number {
    const monthlyRate = annualGrowthRate / 12 / 100;
    let balance = Math.max(0, corpus);
    const withdrawal = Math.max(0, monthlyWithdrawal);
    if (withdrawal === 0) return 50;

    let months = 0;
    const MAX_MONTHS = 600; // 50 years cap
    while (balance > 0 && months < MAX_MONTHS) {
        balance = balance * (1 + monthlyRate) - withdrawal;
        months++;
    }
    return Math.round(months / 12);
}

/**
 * Inflation future cost.
 * FV = currentCost × (1 + rate/100)^years
 */
export function calcInflation(currentCost: number, inflationRate: number, years: number): number {
    return Math.max(0, currentCost) * Math.pow(1 + Math.max(0, inflationRate) / 100, Math.max(0, years));
}

// ─── Calculator Metadata ─────────────────────────────────────────────────────

export const CALCULATOR_META: Record<
    string,
    { title: string; description: string; href: string; icon: string }
> = {
    sip: {
        title: "SIP Calculator",
        description: "Calculate returns on your monthly SIP investments",
        href: "/calculators/sip",
        icon: "TrendingUp",
    },
    lumpsum: {
        title: "Lumpsum Calculator",
        description: "One-time investment growth over time",
        href: "/calculators/lumpsum",
        icon: "DollarSign",
    },
    emi: {
        title: "EMI Calculator",
        description: "Monthly loan payment for home, car, or personal loans",
        href: "/calculators/emi",
        icon: "CreditCard",
    },
    fd: {
        title: "FD Calculator",
        description: "Fixed deposit maturity with compounding options",
        href: "/calculators/fd",
        icon: "PiggyBank",
    },
    ppf: {
        title: "PPF Calculator",
        description: "Public Provident Fund 15-year maturity value",
        href: "/calculators/ppf",
        icon: "Shield",
    },
    hra: {
        title: "HRA Calculator",
        description: "House Rent Allowance tax exemption amount",
        href: "/calculators/hra",
        icon: "Home",
    },
    nps: {
        title: "NPS Calculator",
        description: "National Pension Scheme retirement corpus",
        href: "/calculators/nps",
        icon: "Award",
    },
    retirement: {
        title: "Retirement Calculator",
        description: "Corpus needed to retire comfortably",
        href: "/calculators/retirement",
        icon: "Sunset",
    },
    swp: {
        title: "SWP Calculator",
        description: "How long your corpus sustains monthly withdrawals",
        href: "/calculators/swp",
        icon: "RefreshCw",
    },
    inflation: {
        title: "Inflation Calculator",
        description: "Future value of today's expenses",
        href: "/calculators/inflation",
        icon: "BarChart2",
    },
};
