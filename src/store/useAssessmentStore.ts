import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    migrateLegacyAssessmentKey,
    resolveAssessmentStorageKey,
} from "@/lib/assessment-storage-cleanup";

// One-time legacy localStorage key migration. MUST run before persist
// middleware hydrates. See assessment-storage-cleanup.ts for behavior.
if (typeof window !== "undefined") {
    migrateLegacyAssessmentKey();
}

// ─── Type Definitions ───────────────────────────────────────────────────────

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
    emi?: number;
    interestRate?: number;
    monthsLeft?: number;
    moratoriumMonths?: number;
}

export interface GoalItem {
    id: string;
    type: string;
    name: string;
    cost: number;
    horizon: number;
    currentSavings: number;
    inflation: number;
    importance: string;
}

export interface InsuranceChecklist {
    criticalIllness: boolean;
    personalAccident: boolean;
    disability: boolean;
    maternity: boolean;
}

export interface PersonalHealthPolicy {
    id: string;
    type: string;
    sumInsured: number;
    premium: number;
    copay: number;
}

export interface PersonalLifePolicy {
    id: string;
    type: string;
    sumAssured: number;
    premium: number;
    spouseAge: number;
}

export interface InsuranceState {
    corporateHealth: string;
    corporateHealthMembers: string;
    corporateLife: string;
    personalHealth: PersonalHealthPolicy[];
    personalLife: PersonalLifePolicy[];
    checklist: InsuranceChecklist;
}

export interface AssessmentState {
    // Hydration guard — components must check this before rendering
    _hasHydrated: boolean;
    setHasHydrated: (val: boolean) => void;

    // Reset all wizard state to defaults (used by logout flows).
    resetAssessment: () => void;

    // Step 1
    age: number;
    setAge: (age: number) => void;
    state: string;
    setState: (state: string) => void;
    city: string;
    setCity: (city: string) => void;
    maritalStatus: string;
    setMaritalStatus: (v: string) => void;
    dependents: number;
    setDependents: (v: number) => void;
    childDependents: number;
    setChildDependents: (v: number) => void;
    employmentType: string;
    setEmploymentType: (v: string) => void;
    residencyStatus: string;
    setResidencyStatus: (v: string) => void;
    riskAnswers: Record<number, number>;
    setRiskAnswer: (qId: number, score: number) => void;
    riskTolerance: string;
    setRiskTolerance: (v: string) => void;
    toleranceScore: number | null;
    setToleranceScore: (v: number | null) => void;
    capacityScore: number | null;
    setCapacityScore: (v: number | null) => void;
    compositeScore: number | null;
    setCompositeScore: (v: number | null) => void;

    // Step 2
    incomes: IncomeItem[];
    addIncome: (v: IncomeItem) => void;
    removeIncome: (id: string) => void;
    updateIncome: (id: string, updates: Partial<IncomeItem>) => void;
    expenses: ExpenseItem[];
    addExpense: (v: ExpenseItem) => void;
    removeExpense: (id: string) => void;
    updateExpense: (id: string, updates: Partial<ExpenseItem>) => void;

    // Step 3
    assets: AssetItem[];
    addAsset: (v: AssetItem) => void;
    removeAsset: (id: string) => void;
    liabilities: LiabilityItem[];
    addLiability: (v: LiabilityItem) => void;
    removeLiability: (id: string) => void;

    // Step 4
    goals: GoalItem[];
    addGoal: (v: GoalItem) => void;
    removeGoal: (id: string) => void;
    updateGoal: (id: string, updates: Partial<GoalItem>) => void;

    // Step 5
    insurance: InsuranceState;
    updateInsurance: (updates: Partial<InsuranceState>) => void;
    addPersonalHealth: (policy: PersonalHealthPolicy) => void;
    removePersonalHealth: (id: string) => void;
    addPersonalLife: (policy: PersonalLifePolicy) => void;
    removePersonalLife: (id: string) => void;
    toggleChecklist: (key: keyof InsuranceChecklist) => void;

    // Step 6
    taxRegime: "old" | "new";
    setTaxRegime: (v: "old" | "new") => void;
    investments80C: number;
    setInvestments80C: (amount: number) => void;

    // Navigation
    currentStep: number;
    setCurrentStep: (step: number) => void;
    isComplete: boolean;
    completeAssessment: () => void;
}

// ─── Default Values ──────────────────────────────────────────────────────────

const DEFAULT_INSURANCE: InsuranceState = {
    corporateHealth: "",
    corporateHealthMembers: "",
    corporateLife: "",
    personalHealth: [],
    personalLife: [],
    checklist: {
        criticalIllness: false,
        personalAccident: false,
        disability: false,
        maternity: false,
    },
};

// ─── Initial State ───────────────────────────────────────────────────────────
// All non-action defaults lifted to a top-level constant so resetAssessment()
// and the persist initialiser share one source of truth.

const INITIAL_STATE = {
    _hasHydrated: false,
    age: 30,
    state: "",
    city: "",
    maritalStatus: "",
    dependents: 0,
    childDependents: 0,
    employmentType: "",
    residencyStatus: "",
    riskAnswers: {} as Record<number, number>,
    riskTolerance: "",
    toleranceScore: null as number | null,
    capacityScore: null as number | null,
    compositeScore: null as number | null,
    incomes: [] as IncomeItem[],
    expenses: [] as ExpenseItem[],
    assets: [] as AssetItem[],
    liabilities: [] as LiabilityItem[],
    goals: [] as GoalItem[],
    insurance: DEFAULT_INSURANCE,
    taxRegime: "new" as "old" | "new",
    investments80C: 0,
    currentStep: 0,
    isComplete: false,
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAssessmentStore = create<AssessmentState>()(
    persist(
        (set) => ({
            ...INITIAL_STATE,
            setHasHydrated: (val) => set({ _hasHydrated: val }),
            resetAssessment: () =>
                set((s) => ({
                    ...INITIAL_STATE,
                    // Preserve hydration flag so consumers don't go back to a
                    // pre-hydration loading state after logout reset.
                    _hasHydrated: s._hasHydrated,
                })),

            // Step 1 setters
            setAge: (age) => set({ age }),
            setState: (state) => set({ state }),
            setCity: (city) => set({ city }),
            setMaritalStatus: (v) => set({ maritalStatus: v }),
            setDependents: (v) => set({ dependents: v }),
            setChildDependents: (v) => set({ childDependents: v }),
            setEmploymentType: (v) => set({ employmentType: v }),
            setResidencyStatus: (v) => set({ residencyStatus: v }),
            setRiskAnswer: (qId, score) =>
                set((s) => ({ riskAnswers: { ...s.riskAnswers, [qId]: score } })),
            setRiskTolerance: (v) => set({ riskTolerance: v }),
            setToleranceScore: (v) => set({ toleranceScore: v }),
            setCapacityScore: (v) => set({ capacityScore: v }),
            setCompositeScore: (v) => set({ compositeScore: v }),

            // Step 2
            addIncome: (v) => set((s) => ({ incomes: [...s.incomes, v] })),
            removeIncome: (id) =>
                set((s) => ({ incomes: s.incomes.filter((i) => i.id !== id) })),
            updateIncome: (id, updates) =>
                set((s) => ({
                    incomes: s.incomes.map((i) =>
                        i.id === id ? { ...i, ...updates } : i
                    ),
                })),
            addExpense: (v) => set((s) => ({ expenses: [...s.expenses, v] })),
            removeExpense: (id) =>
                set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
            updateExpense: (id, updates) =>
                set((s) => ({
                    expenses: s.expenses.map((e) =>
                        e.id === id ? { ...e, ...updates } : e
                    ),
                })),

            // Step 3
            addAsset: (v) => set((s) => ({ assets: [...s.assets, v] })),
            removeAsset: (id) =>
                set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),
            addLiability: (v) =>
                set((s) => ({ liabilities: [...s.liabilities, v] })),
            removeLiability: (id) =>
                set((s) => ({
                    liabilities: s.liabilities.filter((l) => l.id !== id),
                })),

            // Step 4
            addGoal: (v) => set((s) => ({ goals: [...s.goals, v] })),
            removeGoal: (id) =>
                set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),
            updateGoal: (id, updates) =>
                set((s) => ({
                    goals: s.goals.map((g) =>
                        g.id === id ? { ...g, ...updates } : g
                    ),
                })),

            // Step 5
            updateInsurance: (updates) =>
                set((s) => ({ insurance: { ...s.insurance, ...updates } })),
            addPersonalHealth: (policy) =>
                set((s) => ({
                    insurance: {
                        ...s.insurance,
                        personalHealth: [...s.insurance.personalHealth, policy],
                    },
                })),
            removePersonalHealth: (id) =>
                set((s) => ({
                    insurance: {
                        ...s.insurance,
                        personalHealth: s.insurance.personalHealth.filter(
                            (p) => p.id !== id
                        ),
                    },
                })),
            addPersonalLife: (policy) =>
                set((s) => ({
                    insurance: {
                        ...s.insurance,
                        personalLife: [...s.insurance.personalLife, policy],
                    },
                })),
            removePersonalLife: (id) =>
                set((s) => ({
                    insurance: {
                        ...s.insurance,
                        personalLife: s.insurance.personalLife.filter(
                            (p) => p.id !== id
                        ),
                    },
                })),
            toggleChecklist: (key) =>
                set((s) => ({
                    insurance: {
                        ...s.insurance,
                        checklist: {
                            ...s.insurance.checklist,
                            [key]: !s.insurance.checklist[key],
                        },
                    },
                })),

            // Step 6
            setTaxRegime: (v) => set({ taxRegime: v }),
            setInvestments80C: (amount) => set({ investments80C: amount }),

            // Navigation
            setCurrentStep: (step) => set({ currentStep: step }),
            completeAssessment: () => set({ isComplete: true }),
        }),
        {
            name: resolveAssessmentStorageKey(),
            onRehydrateStorage: () => (state) => {
                if (state) state.setHasHydrated(true);
            },
        }
    )
);
