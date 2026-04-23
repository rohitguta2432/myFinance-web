/**
 * Assessment API client — DTO mappers + API functions for all assessment steps.
 * Mirrors the React app's assessmentApi.js with full TypeScript types.
 */

import { api } from "@/lib/api-client";

// ─── Enum Conversion Maps ────────────────────────────────────────────────────

const MARITAL_TO_DB: Record<string, string> = {
    single: "SINGLE",
    married: "MARRIED",
    divorced: "DIVORCED",
    widowed: "WIDOWED",
};
const MARITAL_FROM_DB: Record<string, string> = Object.fromEntries(
    Object.entries(MARITAL_TO_DB).map(([k, v]) => [v, k])
);

const RISK_TO_DB: Record<string, string> = {
    low: "CONSERVATIVE",
    medium: "MODERATE",
    high: "AGGRESSIVE",
};
const RISK_FROM_DB: Record<string, string> = Object.fromEntries(
    Object.entries(RISK_TO_DB).map(([k, v]) => [v, k])
);

const FREQ_TO_DB: Record<string, string> = {
    Monthly: "MONTHLY",
    Quarterly: "QUARTERLY",
    Yearly: "YEARLY",
    "One-time": "ONE_TIME",
};
const FREQ_FROM_DB: Record<string, string> = Object.fromEntries(
    Object.entries(FREQ_TO_DB).map(([k, v]) => [v, k])
);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProfileDTO {
    age: number;
    state: string;
    city: string;
    maritalStatus: string;
    dependents: number;
    childDependents: number;
    employmentType: string;
    residencyStatus: string;
    riskTolerance: string;
    riskAnswers: Record<number, number>;
    retirementAge?: number;
}

export interface IncomeItem {
    id: string;
    source: string;
    amount: number;
    frequency: string;
    taxDeducted?: boolean;
    tdsPercentage?: number;
    description?: string;
}

export interface ExpenseItem {
    id: string;
    category: string;
    amount: number;
    frequency: string;
    type: string;
    description?: string;
}

export interface AssetItem {
    id: string;
    category: string;
    subCategory?: string;
    name: string;
    amount: number;
    timeHorizon?: string;
    purchaseValue?: number;
    liquidity?: string;
}

export interface LiabilityItem {
    id: string;
    category: string;
    name: string;
    amount: number;
    emi: number;
    interestRate: number;
    monthsLeft?: number;
    moratoriumMonths?: number;
}

export interface FinancialsData {
    incomes: IncomeItem[];
    expenses: ExpenseItem[];
}

export interface BalanceSheetData {
    assets: AssetItem[];
    liabilities: LiabilityItem[];
}

export type AllocationStatus = "ON_TRACK" | "ABOVE" | "BELOW";

export interface AllocationRow {
    label: string;
    currentPct: number;
    targetPct: number;
    diffPct: number;
    thresholdPct: number;
    status: AllocationStatus;
}

export interface PortfolioAnalysis {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    monthlyEmiTotal: number;
    avgInterestRate: number;
    dtiRatio: number;
    monthlyIncome: number;
    cashFlowEMI: number;
    emiMismatch: boolean;
    equityPct: number;
    debtPct: number;
    realEstatePct: number;
    goldPct: number;
    otherPct: number;
    equityTotal: number;
    debtTotal: number;
    realEstateTotal: number;
    goldTotal: number;
    otherTotal: number;
    allocationStatus?: AllocationRow[];
}

export interface RiskScoring {
    profileLabel: string;
    targetEquity: number;
    targetDebt: number;
    targetGold: number;
    targetRealEstate: number;
    toleranceScore: number;
    capacityScore: number;
    compositeScore: number;
    riskTolerance: string;
}

// ─── Field Mappers ────────────────────────────────────────────────────────────

function mapProfileToDTO(data: ProfileDTO) {
    return {
        age: data.age ? parseInt(String(data.age)) : null,
        state: data.state || null,
        city: data.city || null,
        maritalStatus:
            MARITAL_TO_DB[data.maritalStatus] ||
            data.maritalStatus?.toUpperCase(),
        dependents: parseInt(String(data.dependents)) || 0,
        childDependents: parseInt(String(data.childDependents)) || 0,
        employmentType: data.employmentType
            ?.toUpperCase()
            .replace(/ /g, "_"),
        residencyStatus: data.residencyStatus?.toUpperCase(),
        riskScore: null,
        riskTolerance:
            RISK_TO_DB[data.riskTolerance] ||
            data.riskTolerance?.toUpperCase(),
        riskAnswers: data.riskAnswers || {},
        ...(data.retirementAge != null ? { retirementAge: data.retirementAge } : {}),
    };
}

function mapProfileFromDTO(dto: Record<string, unknown>): ProfileDTO {
    return {
        age: (dto.age as number) ?? 30,
        state: (dto.state as string) ?? "",
        city: (dto.city as string) ?? "",
        maritalStatus:
            MARITAL_FROM_DB[dto.maritalStatus as string] ??
            (dto.maritalStatus as string)?.toLowerCase() ??
            "",
        dependents: (dto.dependents as number) ?? 0,
        childDependents: (dto.childDependents as number) ?? 0,
        employmentType: dto.employmentType
            ? (dto.employmentType as string).charAt(0).toUpperCase() +
              (dto.employmentType as string)
                  .slice(1)
                  .toLowerCase()
                  .replace(/_/g, " ")
            : "",
        residencyStatus: dto.residencyStatus
            ? (dto.residencyStatus as string).charAt(0).toUpperCase() +
              (dto.residencyStatus as string).slice(1).toLowerCase()
            : "",
        riskTolerance:
            RISK_FROM_DB[dto.riskTolerance as string] ??
            (dto.riskTolerance as string)?.toLowerCase() ??
            "",
        riskAnswers:
            (dto.riskAnswers as Record<number, number>) ?? {},
        retirementAge: (dto.retirementAge as number) ?? undefined,
    };
}

function mapIncomeToDTO(data: Omit<IncomeItem, "id">) {
    return {
        sourceName: data.source,
        amount: parseFloat(String(data.amount)) || 0,
        frequency: FREQ_TO_DB[data.frequency] || data.frequency?.toUpperCase(),
        taxDeducted: data.taxDeducted || false,
        tdsPercentage: parseFloat(String(data.tdsPercentage)) || 0,
    };
}

function mapIncomeFromDTO(dto: Record<string, unknown>): IncomeItem {
    return {
        id: dto.id as string,
        source: dto.sourceName as string,
        amount: dto.amount as number,
        frequency:
            FREQ_FROM_DB[dto.frequency as string] ??
            (dto.frequency as string) ??
            "Monthly",
        taxDeducted: (dto.taxDeducted as boolean) || false,
        tdsPercentage: (dto.tdsPercentage as number) || 0,
    };
}

function mapExpenseToDTO(data: Omit<ExpenseItem, "id">) {
    return {
        category: data.category,
        amount: parseFloat(String(data.amount)) || 0,
        frequency: FREQ_TO_DB[data.frequency] || data.frequency?.toUpperCase(),
        isEssential: data.type?.toLowerCase() === "essential",
    };
}

function mapExpenseFromDTO(dto: Record<string, unknown>): ExpenseItem {
    return {
        id: dto.id as string,
        category: dto.category as string,
        amount: dto.amount as number,
        frequency:
            FREQ_FROM_DB[dto.frequency as string] ??
            (dto.frequency as string) ??
            "Monthly",
        type: (dto.isEssential as boolean) ? "Essential" : "Discretionary",
    };
}

function mapAssetToDTO(data: Omit<AssetItem, "id">) {
    return {
        assetType: data.subCategory || data.category,
        name: data.name,
        currentValue: parseFloat(String(data.amount)) || 0,
        allocationPercentage: null,
        category: data.category,
        timeHorizon: data.timeHorizon,
    };
}

function mapAssetFromDTO(dto: Record<string, unknown>): AssetItem {
    return {
        id: dto.id as string,
        category: (dto.assetType as string) || (dto.category as string),
        subCategory: dto.assetType as string,
        name: dto.name as string,
        amount: (dto.currentValue as number) || 0,
        timeHorizon: dto.timeHorizon as string | undefined,
    };
}

function mapLiabilityToDTO(data: Omit<LiabilityItem, "id">) {
    return {
        liabilityType: data.category,
        name: data.name,
        outstandingAmount: parseFloat(String(data.amount)) || 0,
        monthlyEmi: parseFloat(String(data.emi)) || 0,
        interestRate: parseFloat(String(data.interestRate)) || 0,
        monthsLeft: data.monthsLeft ? parseInt(String(data.monthsLeft), 10) : null,
        moratoriumMonths: data.moratoriumMonths
            ? parseInt(String(data.moratoriumMonths), 10)
            : null,
    };
}

function mapLiabilityFromDTO(dto: Record<string, unknown>): LiabilityItem {
    return {
        id: dto.id as string,
        category: (dto.liabilityType as string) || "",
        name: (dto.name as string) || "",
        amount: (dto.outstandingAmount as number) || 0,
        emi: (dto.monthlyEmi as number) || 0,
        interestRate: (dto.interestRate as number) || 0,
        monthsLeft: dto.monthsLeft as number | undefined,
    };
}

// ─── API Functions ────────────────────────────────────────────────────────────

// Step 1: Profile
export async function getProfile(): Promise<ProfileDTO> {
    const dto = await api.get<Record<string, unknown>>("/profile");
    return mapProfileFromDTO(dto);
}

export async function saveProfile(data: ProfileDTO): Promise<ProfileDTO> {
    const dto = await api.post<Record<string, unknown>>(
        "/profile",
        mapProfileToDTO(data)
    );
    return mapProfileFromDTO(dto);
}

// Step 2: Financials
export async function getFinancials(): Promise<FinancialsData> {
    const dto = await api.get<{
        incomes?: Record<string, unknown>[];
        expenses?: Record<string, unknown>[];
    }>("/cashflow");
    return {
        incomes: (dto.incomes || []).map(mapIncomeFromDTO),
        expenses: (dto.expenses || []).map(mapExpenseFromDTO),
    };
}

export async function addIncome(
    data: Omit<IncomeItem, "id">
): Promise<IncomeItem> {
    const dto = await api.post<Record<string, unknown>>(
        "/cashflow/income",
        mapIncomeToDTO(data)
    );
    return mapIncomeFromDTO(dto);
}

export async function addExpense(
    data: Omit<ExpenseItem, "id">
): Promise<ExpenseItem> {
    const dto = await api.post<Record<string, unknown>>(
        "/cashflow/expense",
        mapExpenseToDTO(data)
    );
    return mapExpenseFromDTO(dto);
}

export async function deleteIncome(id: string): Promise<void> {
    await api.delete(`/cashflow/income/${id}`);
}

export async function deleteExpense(id: string): Promise<void> {
    await api.delete(`/cashflow/expense/${id}`);
}

export async function updateIncome(
    data: IncomeItem
): Promise<IncomeItem> {
    const { id, ...rest } = data;
    const dto = await api.put<Record<string, unknown>>(
        `/cashflow/income/${id}`,
        mapIncomeToDTO(rest)
    );
    return mapIncomeFromDTO(dto);
}

export async function updateExpense(
    data: ExpenseItem
): Promise<ExpenseItem> {
    const { id, ...rest } = data;
    const dto = await api.put<Record<string, unknown>>(
        `/cashflow/expense/${id}`,
        mapExpenseToDTO(rest)
    );
    return mapExpenseFromDTO(dto);
}

// Step 3: Balance Sheet
export async function getBalanceSheet(): Promise<BalanceSheetData> {
    const dto = await api.get<{
        assets?: Record<string, unknown>[];
        liabilities?: Record<string, unknown>[];
    }>("/networth");
    return {
        assets: (dto.assets || []).map(mapAssetFromDTO),
        liabilities: (dto.liabilities || []).map(mapLiabilityFromDTO),
    };
}

export async function addAsset(
    data: Omit<AssetItem, "id">
): Promise<AssetItem> {
    const dto = await api.post<Record<string, unknown>>(
        "/networth/asset",
        mapAssetToDTO(data)
    );
    return mapAssetFromDTO(dto);
}

export async function addLiability(
    data: Omit<LiabilityItem, "id">
): Promise<LiabilityItem> {
    const dto = await api.post<Record<string, unknown>>(
        "/networth/liability",
        mapLiabilityToDTO(data)
    );
    return mapLiabilityFromDTO(dto);
}

export async function updateAsset(
    data: AssetItem
): Promise<AssetItem> {
    const { id, ...rest } = data;
    const dto = await api.put<Record<string, unknown>>(
        `/networth/asset/${id}`,
        mapAssetToDTO(rest)
    );
    return mapAssetFromDTO(dto);
}

export async function updateLiability(
    data: LiabilityItem
): Promise<LiabilityItem> {
    const { id, ...rest } = data;
    const dto = await api.put<Record<string, unknown>>(
        `/networth/liability/${id}`,
        mapLiabilityToDTO(rest)
    );
    return mapLiabilityFromDTO(dto);
}

export async function deleteAsset(id: string): Promise<void> {
    await api.delete(`/networth/asset/${id}`);
}

export async function deleteLiability(id: string): Promise<void> {
    await api.delete(`/networth/liability/${id}`);
}

// Portfolio & Risk
export async function getPortfolioAnalysis(): Promise<PortfolioAnalysis> {
    return api.get<PortfolioAnalysis>("/portfolio-analysis");
}

export async function getRiskScoring(): Promise<RiskScoring> {
    return api.get<RiskScoring>("/risk-scoring");
}

// ─── Step 4: Goals ────────────────────────────────────────────────────────────

export interface GoalAPIItem {
    id: string;
    type: string;
    name: string;
    cost: number;
    horizon: number;
    currentSavings: number;
    inflation: number;
    importance: string;
}

export interface GoalProjection {
    totalGoals: number;
    totalAdjustedTarget: number;
    totalCurrentSavings: number;
    totalSipRequired: number;
    monthlySurplus: number;
    isAchievable: boolean;
    remainingBuffer: number;
    shortfall: number;
    monthlyExpenses: number;
    emergencyTargetMonths: number;
    emergencyFundTarget: number;
    emergencyFundCurrent: number;
    emergencyFundGap: number;
    emergencyCoverageMonths: number;
    emergencyAggressiveMonths: number;
    emergencyConservativeMonths: number;
    goals: Array<{
        id: string;
        bufferedCost: number;
        currentSavings: number;
        requiredSip: number;
        progressPercent: number;
    }>;
}

export interface RetirementAutoFill {
    status: "CRITICAL" | "MODERATE" | "ON_TRACK";
    currentAge: number;
    retirementAge: number;
    yearsToRetirement: number;
    monthlyExpense: number;
    futureMonthlyExpense: number;
    corpusRequired: number;
    currentRetirementAssets: number;
    projectedAssets: number;
    gap: number;
    onTrackPercent: number;
    sipFlat: number;
    sipStepUpStart: number;
    stepUpRate: number;
    sipIfDelayed: number;
    delayYears: number;
}

function mapGoalToDTO(data: Omit<GoalAPIItem, "id">) {
    return {
        goalType: data.type?.toUpperCase(),
        goalName: data.name,
        targetAmount: parseFloat(String(data.cost)) || 0,
        timeHorizonYears: parseInt(String(data.horizon)) || 5,
        currentSavings: parseFloat(String(data.currentSavings)) || 0,
        inflationRate: parseFloat(String(data.inflation)) || 6,
        priority: data.importance?.toUpperCase(),
    };
}

function mapGoalFromDTO(dto: Record<string, unknown>): GoalAPIItem {
    const rawType = ((dto.goalType ?? dto.goal_type ?? dto.type) as string) || "";
    const rawName = ((dto.goalName ?? dto.goal_name ?? dto.name ?? dto.title) as string) || "";
    return {
        id: String(dto.id ?? dto.goalId ?? dto.goal_id ?? ""),
        type: rawType.toLowerCase(),
        name: rawName,
        cost: ((dto.targetAmount ?? dto.target_amount ?? dto.cost) as number) || 0,
        horizon: ((dto.timeHorizonYears ?? dto.time_horizon_years ?? dto.timeHorizon ?? dto.time_horizon ?? dto.horizon) as number) || 5,
        currentSavings: ((dto.currentSavings ?? dto.current_savings) as number) || 0,
        inflation: ((dto.inflationRate ?? dto.inflation_rate ?? dto.inflation) as number) || 6,
        importance: (dto.priority as string)
            ? (dto.priority as string).charAt(0).toUpperCase() +
              (dto.priority as string).slice(1).toLowerCase()
            : "High",
    };
}

export async function getGoals(): Promise<GoalAPIItem[]> {
    const dto = await api.get<
        Record<string, unknown>[] | { goals?: Record<string, unknown>[] }
    >("/goals");
    const list = Array.isArray(dto)
        ? dto
        : ((dto as { goals?: Record<string, unknown>[] }).goals || []);
    return list.map(mapGoalFromDTO);
}

export async function addGoal(
    data: Omit<GoalAPIItem, "id">
): Promise<GoalAPIItem> {
    const dto = await api.post<Record<string, unknown>>(
        "/goals",
        mapGoalToDTO(data)
    );
    return mapGoalFromDTO(dto);
}

export async function updateGoal(data: GoalAPIItem): Promise<GoalAPIItem> {
    const { id, ...rest } = data;
    const dto = await api.put<Record<string, unknown>>(
        `/goals/${id}`,
        mapGoalToDTO(rest)
    );
    return mapGoalFromDTO(dto);
}

export async function deleteGoal(id: string): Promise<void> {
    await api.delete(`/goals/${id}`);
}

export async function getGoalProjection(): Promise<GoalProjection> {
    return api.get<GoalProjection>("/goal-projection");
}

export async function getRetirementAutoFill(): Promise<RetirementAutoFill> {
    return api.get<RetirementAutoFill>("/goals/retirement-autofill");
}

// ─── Step 5: Insurance ────────────────────────────────────────────────────────

export interface InsuranceSavePayload {
    life: number;
    health: number;
}

export interface InsuranceGapData {
    recommendedLifeCover: number;
    recommendedHealthCover: number;
}

export async function getInsurance(): Promise<InsuranceSavePayload> {
    return api.get<InsuranceSavePayload>("/insurance");
}

export async function saveInsurance(data: InsuranceSavePayload): Promise<void> {
    await api.post("/insurance", data);
}

export async function getInsuranceGap(): Promise<InsuranceGapData> {
    return api.get<InsuranceGapData>("/insurance/gap");
}

// ─── Step 6: Tax ──────────────────────────────────────────────────────────────

/** All granular deduction inputs persisted on /tax POST. Backend recomputes totals. */
export interface TaxData {
    selectedRegime: "OLD" | "NEW";
    // 80C components
    ppfElssAmount?: number;
    epfVpfAmount?: number;
    tuitionFeesAmount?: number;
    licPremiumAmount?: number;
    homeLoanPrincipal?: number;
    nscFdAmount?: number;
    // 80D medical
    healthInsurancePremium?: number;
    parentsHealthInsurance?: number;
    parentsHealthInsuranceSenior?: number;
    // Other
    additionalNpsAmount?: number;       // 80CCD(1B)
    homeLoanInterest?: number;          // 24(b)
    educationLoanInterest?: number;     // 80E
    donationsAmount?: number;           // 80G
    // Server-computed (read-only)
    calculatedTaxOld?: number;
    calculatedTaxNew?: number;
}

export interface TaxRegimeDetail {
    grossIncome: number;
    standardDeduction: number;
    deductions80C: number;
    deductions80D: number;
    hraExemption: number;
    otherDeductions: number;
    netTaxable: number;
    baseTax: number;
    cess: number;
    totalTax: number;
}

export interface TaxCalculationResult {
    grossTotalIncome: number;
    incomeCategories: Record<string, number>;
    hraExemption: number;
    annualRentPaid: number;
    annualBasic: number;
    actualHraReceived: number;
    autoEpf: number;
    autoLifeInsurance: number;
    oldRegime: TaxRegimeDetail;
    newRegime: TaxRegimeDetail;
    recommendedRegime: "old" | "new";
    savings: number;
}

/** Granular deduction inputs sent to /tax-calculation query. */
export interface TaxCalculationParams {
    ppfNps?: number;
    homeLoanPrincipal?: number;
    tuitionFees?: number;
    nscFd?: number;
    medSelfSpouse?: number;
    medParentsLt60?: number;
    medParentsGt60?: number;
    additionalNps?: number;
    homeLoanInterest?: number;
    educationLoanInterest?: number;
    donations?: number;
}

export async function getTax(): Promise<TaxData> {
    return api.get<TaxData>("/tax");
}

export async function saveTax(data: TaxData): Promise<TaxData> {
    return api.post<TaxData>("/tax", data);
}

export async function getTaxCalculation(
    params: TaxCalculationParams
): Promise<TaxCalculationResult> {
    const query = new URLSearchParams(
        Object.fromEntries(
            Object.entries(params).map(([k, v]) => [k, String(v ?? 0)])
        )
    ).toString();
    return api.get<TaxCalculationResult>(`/tax-calculation?${query}`);
}
