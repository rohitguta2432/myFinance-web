import { create } from "zustand";
import { persist } from "zustand/middleware";

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

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAssessmentStore = create<AssessmentState>()(
    persist(
        (set) => ({
            _hasHydrated: false,
            setHasHydrated: (val) => set({ _hasHydrated: val }),

            // Step 1 defaults
            age: 30,
            setAge: (age) => set({ age }),
            state: "",
            setState: (state) => set({ state }),
            city: "",
            setCity: (city) => set({ city }),
            maritalStatus: "",
            setMaritalStatus: (v) => set({ maritalStatus: v }),
            dependents: 0,
            setDependents: (v) => set({ dependents: v }),
            childDependents: 0,
            setChildDependents: (v) => set({ childDependents: v }),
            employmentType: "",
            setEmploymentType: (v) => set({ employmentType: v }),
            residencyStatus: "",
            setResidencyStatus: (v) => set({ residencyStatus: v }),
            riskAnswers: {},
            setRiskAnswer: (qId, score) =>
                set((s) => ({ riskAnswers: { ...s.riskAnswers, [qId]: score } })),
            riskTolerance: "",
            setRiskTolerance: (v) => set({ riskTolerance: v }),
            toleranceScore: null,
            setToleranceScore: (v) => set({ toleranceScore: v }),
            capacityScore: null,
            setCapacityScore: (v) => set({ capacityScore: v }),
            compositeScore: null,
            setCompositeScore: (v) => set({ compositeScore: v }),

            // Step 2
            incomes: [],
            addIncome: (v) => set((s) => ({ incomes: [...s.incomes, v] })),
            removeIncome: (id) =>
                set((s) => ({ incomes: s.incomes.filter((i) => i.id !== id) })),
            updateIncome: (id, updates) =>
                set((s) => ({
                    incomes: s.incomes.map((i) =>
                        i.id === id ? { ...i, ...updates } : i
                    ),
                })),
            expenses: [],
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
            assets: [],
            addAsset: (v) => set((s) => ({ assets: [...s.assets, v] })),
            removeAsset: (id) =>
                set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),
            liabilities: [],
            addLiability: (v) =>
                set((s) => ({ liabilities: [...s.liabilities, v] })),
            removeLiability: (id) =>
                set((s) => ({
                    liabilities: s.liabilities.filter((l) => l.id !== id),
                })),

            // Step 4
            goals: [],
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
            insurance: DEFAULT_INSURANCE,
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
            taxRegime: "new",
            setTaxRegime: (v) => set({ taxRegime: v }),
            investments80C: 0,
            setInvestments80C: (amount) => set({ investments80C: amount }),

            // Navigation
            currentStep: 0,
            setCurrentStep: (step) => set({ currentStep: step }),
            isComplete: false,
            completeAssessment: () => set({ isComplete: true }),
        }),
        {
            name: "assessment-storage", // matches React app — survives migration
            onRehydrateStorage: () => (state) => {
                if (state) state.setHasHydrated(true);
            },
        }
    )
);
