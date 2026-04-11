"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    X,
    CheckCircle2,
    AlertTriangle,
    Pencil,
    Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import {
    useFinancialsQuery,
    useAddIncomeMutation,
    useAddExpenseMutation,
    useDeleteIncomeMutation,
    useDeleteExpenseMutation,
    useUpdateIncomeMutation,
    useUpdateExpenseMutation,
} from "@/hooks/assessment/useFinancials";
import { StepNavigation } from "@/components/assessment/step-navigation";
import type { IncomeItem, ExpenseItem } from "@/lib/assessment-api";

// ─── Emoji Maps ────────────────────────────────────────────────────────────────

const INCOME_EMOJI: Record<string, string> = {
    Salary: "💼",
    "Business Income": "🏢",
    "Agriculture Income": "🌾",
    Freelancing: "💻",
    "Rental Income": "🏠",
    "Dividend Income": "📈",
    "Interest Income": "🏦",
    "Bonus/Incentive": "🎁",
    "Capital Gains (from selling stocks/property)": "📊",
    Pension: "🏖️",
    Other: "➕",
};

const EXPENSE_EMOJI: Record<string, string> = {
    "Rent/Mortgage": "🏠",
    "EMIs (loan payments)": "💳",
    "Utilities (electricity, water, gas)": "💡",
    Transportation: "🚗",
    "Food & Groceries": "🛒",
    "Shopping (clothes, personal care)": "🛍️",
    "Entertainment (movies, dining out)": "🎬",
    "Subscriptions (Netflix, gym, etc.)": "📺",
    Healthcare: "🏥",
    Education: "🎓",
    "Insurance Premiums": "🛡️",
    Childcare: "👶",
    "Pet Care": "🐾",
    "Travel & Vacations": "✈️",
    "Gifts & Donations": "🎁",
    Other: "➕",
};

const EMI_CATEGORY = "EMIs (loan payments)";

function getIncomeDisplay(source: string): { emoji: string; name: string } {
    const clean = source?.replace(/^[\p{Emoji}\p{Emoji_Presentation}\s]+/u, "") || source;
    const emoji =
        INCOME_EMOJI[clean] ||
        Object.entries(INCOME_EMOJI).find(([k]) => clean?.includes(k))?.[1] ||
        "💰";
    return { emoji, name: clean };
}

function getExpenseDisplay(category: string): { emoji: string; name: string } {
    const clean = category?.replace(/^[\p{Emoji}\p{Emoji_Presentation}\s]+/u, "") || category;
    const emoji =
        EXPENSE_EMOJI[clean] ||
        Object.entries(EXPENSE_EMOJI).find(([k]) => clean?.includes(k))?.[1] ||
        "📋";
    return { emoji, name: clean };
}

function calculateMonthly(item: { amount: number; frequency: string }): number {
    if (item.frequency === "Monthly") return item.amount;
    if (item.frequency === "Quarterly") return item.amount / 3;
    if (item.frequency === "Yearly") return item.amount / 12;
    return item.amount / 12; // One-time amortized
}

// ─── Inline Styles ────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
    background: "#0F172A",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    background: "#0B0F1A",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#F1F5F9",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    background: "#0B0F1A",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#F1F5F9",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#94A3B8",
    marginBottom: 8,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Step2Page() {
    const router = useRouter();
    const {
        incomes,
        addIncome: storeAddIncome,
        removeIncome,
        updateIncome: storeUpdateIncome,
        expenses,
        addExpense: storeAddExpense,
        removeExpense,
        updateExpense: storeUpdateExpense,
        liabilities,
    } = useAssessmentStore();

    // API
    const { data: financialsData, isLoading: isFetchingFinancials } = useFinancialsQuery();
    const { mutateAsync: addIncomeApi } = useAddIncomeMutation();
    const { mutateAsync: addExpenseApi } = useAddExpenseMutation();
    const { mutateAsync: deleteIncomeApi, isPending: isDeletingIncome } = useDeleteIncomeMutation();
    const { mutateAsync: deleteExpenseApi, isPending: isDeletingExpense } = useDeleteExpenseMutation();
    const { mutateAsync: updateIncomeApi } = useUpdateIncomeMutation();
    const { mutateAsync: updateExpenseApi } = useUpdateExpenseMutation();

    // Hydrate from API
    useEffect(() => {
        if (financialsData) {
            if (financialsData.incomes) {
                useAssessmentStore.setState({ incomes: financialsData.incomes });
            }
            if (financialsData.expenses) {
                useAssessmentStore.setState({ expenses: financialsData.expenses });
            }
        }
    }, [financialsData]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"income" | "expense">("expense");
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [frequency, setFrequency] = useState("Monthly");
    const [isEssential, setIsEssential] = useState(true);
    const [taxDeducted, setTaxDeducted] = useState(false);
    const [tdsPercentage, setTdsPercentage] = useState(10);
    const [description, setDescription] = useState("");

    const openModal = (type: "income" | "expense", item?: IncomeItem | ExpenseItem) => {
        setModalType(type);
        if (item) {
            setEditingId(item.id);
            setCategory(type === "income" ? (item as IncomeItem).source : (item as ExpenseItem).category);
            setAmount(item.amount.toString());
            setFrequency(item.frequency);
            setDescription((item as IncomeItem).description || "");
            if (type === "income") {
                const inc = item as IncomeItem;
                setTaxDeducted(inc.taxDeducted || false);
                setTdsPercentage(inc.tdsPercentage || 10);
            } else {
                const exp = item as ExpenseItem;
                setIsEssential(exp.type === "Essential" || exp.type === "essential");
            }
        } else {
            setEditingId(null);
            setCategory(type === "income" ? "Salary" : "Rent/Mortgage");
            setAmount("");
            setFrequency("Monthly");
            setTaxDeducted(false);
            setTdsPercentage(10);
            setIsEssential(true);
            setDescription("");
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (modalType === "income") {
            const incomeItem: IncomeItem = {
                id: editingId || `inc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                source: category,
                amount: parseFloat(amount) || 0,
                frequency,
                taxDeducted,
                tdsPercentage: taxDeducted ? parseFloat(String(tdsPercentage)) || 0 : 0,
                description: description.trim() || undefined,
            };
            if (editingId) {
                const prev = incomes.find((i) => i.id === editingId);
                storeUpdateIncome(editingId, incomeItem);
                try {
                    await updateIncomeApi(incomeItem);
                } catch {
                    if (prev) storeUpdateIncome(editingId, prev);
                    toast.error("Could not update income — change reverted, check your connection");
                }
            } else {
                storeAddIncome(incomeItem);
                try {
                    await addIncomeApi(incomeItem);
                } catch {
                    removeIncome(incomeItem.id);
                    toast.error("Could not save income — check your connection and try again");
                }
            }
        } else {
            const expenseItem: ExpenseItem = {
                id: editingId || `exp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                category,
                amount: parseFloat(amount) || 0,
                frequency,
                type: isEssential ? "Essential" : "Discretionary",
                description: description.trim() || undefined,
            };
            if (editingId) {
                const prev = expenses.find((e) => e.id === editingId);
                storeUpdateExpense(editingId, expenseItem);
                try {
                    await updateExpenseApi(expenseItem);
                } catch {
                    if (prev) storeUpdateExpense(editingId, prev);
                    toast.error("Could not update expense — change reverted, check your connection");
                }
            } else {
                storeAddExpense(expenseItem);
                try {
                    await addExpenseApi(expenseItem);
                } catch {
                    removeExpense(expenseItem.id);
                    toast.error("Could not save expense — check your connection and try again");
                }
            }
        }
        setIsModalOpen(false);
    };

    // Derived values
    const totalMonthlyIncome = incomes.reduce((sum, item) => sum + calculateMonthly(item), 0);
    const totalMonthlyExpenses = expenses.reduce((sum, item) => sum + calculateMonthly(item), 0);
    const totalMonthlyEMIs = expenses
        .filter((exp) => exp.category?.includes(EMI_CATEGORY))
        .reduce((sum, item) => sum + calculateMonthly(item), 0);
    const nonEMIExpenses = totalMonthlyExpenses - totalMonthlyEMIs;
    const discretionaryList = expenses.filter((e) => e.type === "Discretionary");
    const totalDiscretionary = discretionaryList.reduce((sum, item) => sum + calculateMonthly(item), 0);
    const surplus = totalMonthlyIncome - totalMonthlyExpenses;
    const savingsRate =
        totalMonthlyIncome > 0 ? Math.round((surplus / totalMonthlyIncome) * 100) : 0;
    const liabilitiesEMITotal = liabilities.reduce((sum, l) => sum + (parseFloat(String(l.emi)) || 0), 0);
    const emiMismatch =
        (totalMonthlyEMIs > 0 || liabilitiesEMITotal > 0) &&
        Math.abs(totalMonthlyEMIs - liabilitiesEMITotal) > 1;
    const hypotheticalTotalExpenses = totalMonthlyExpenses - totalDiscretionary * 0.3;
    const hypotheticalSurplus = totalMonthlyIncome - hypotheticalTotalExpenses;
    const hypotheticalSavingsRate =
        totalMonthlyIncome > 0
            ? Math.round((hypotheticalSurplus / totalMonthlyIncome) * 100)
            : 0;

    if (isFetchingFinancials) {
        return (
            <div style={{ padding: "24px 24px 120px", maxWidth: 800, margin: "0 auto" }}>
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        style={{
                            background: "linear-gradient(90deg, #0F172A 25%, #1E293B 50%, #0F172A 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.5s infinite",
                            borderRadius: 12,
                            height: 72,
                            marginBottom: 12,
                        }}
                    />
                ))}
                <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px 24px 120px", maxWidth: 800, margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#F1F5F9", margin: "0 0 8px" }}>
                    Your Cash Flow Reality Check
                </h1>
                <p style={{ fontSize: 14, color: "#94A3B8", margin: 0 }}>
                    Understanding your money flow is step one to controlling it.
                </p>
            </div>

            {/* ── Income Section ─────────────────────────────────────────────── */}
            <div style={{ marginBottom: 8 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", margin: "0 0 12px" }}>
                    Income Sources
                </h2>
            </div>

            {incomes.map((inc) => {
                const { emoji, name } = getIncomeDisplay(inc.source);
                return (
                    <div key={inc.id} style={{ ...card, marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                                background: "rgba(16,185,129,0.1)", padding: "10px",
                                borderRadius: 8, fontSize: 18, lineHeight: 1,
                            }}>
                                {emoji}
                            </div>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>{name}</p>
                                <p style={{ fontSize: 12, color: "#94A3B8", margin: "2px 0 0" }}>
                                    {inc.frequency}
                                    {inc.taxDeducted && (
                                        <span style={{ marginLeft: 6, color: "rgba(16,185,129,0.7)" }}>
                                            ({inc.tdsPercentage}% TDS)
                                        </span>
                                    )}
                                    {inc.description && (
                                        <span style={{ display: "block", color: "#64748B", marginTop: 2 }}>
                                            {inc.description}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", fontVariantNumeric: "tabular-nums" }}>
                                ₹ {inc.amount.toLocaleString("en-IN")}
                            </span>
                            <button
                                onClick={() => openModal("income", inc)}
                                style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", padding: 4 }}
                            >
                                <Pencil style={{ width: 14, height: 14 }} />
                            </button>
                            <button
                                onClick={async () => {
                                    removeIncome(inc.id);
                                    try { await deleteIncomeApi(inc.id); } catch { /* already removed locally */ }
                                }}
                                disabled={isDeletingIncome}
                                style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: 4, opacity: isDeletingIncome ? 0.5 : 1 }}
                            >
                                <X style={{ width: 14, height: 14 }} />
                            </button>
                        </div>
                    </div>
                );
            })}

            <button
                onClick={() => openModal("income")}
                style={{
                    width: "100%", padding: "12px", marginBottom: 32,
                    border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "transparent", color: "#94A3B8", fontSize: 14, fontWeight: 500,
                    cursor: "pointer", transition: "border-color 0.15s, color 0.15s",
                    boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(16,185,129,0.3)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#10B981";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
                }}
            >
                <Plus style={{ width: 18, height: 18 }} />
                Add Income Source
            </button>

            {/* ── Expense Section ────────────────────────────────────────────── */}
            <div style={{ marginBottom: 8 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", margin: "0 0 12px" }}>
                    Expenses
                </h2>
            </div>

            {expenses.map((exp) => {
                const { emoji, name } = getExpenseDisplay(exp.category);
                return (
                    <div key={exp.id} style={{ ...card, marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                                background: "rgba(239,68,68,0.1)", padding: "10px",
                                borderRadius: 8, fontSize: 18, lineHeight: 1,
                            }}>
                                {emoji}
                            </div>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>
                                    {name}
                                    <span style={{
                                        marginLeft: 6, fontSize: 11, fontWeight: 400,
                                        background: "#1E293B", padding: "2px 6px", borderRadius: 4,
                                        color: "#94A3B8",
                                    }}>
                                        {exp.type}
                                    </span>
                                </p>
                                <p style={{ fontSize: 12, color: "#94A3B8", margin: "2px 0 0" }}>
                                    {exp.frequency}
                                    {exp.description && (
                                        <span style={{ display: "block", color: "#64748B", marginTop: 2 }}>
                                            {exp.description}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9", fontVariantNumeric: "tabular-nums" }}>
                                ₹ {exp.amount.toLocaleString("en-IN")}
                            </span>
                            <button
                                onClick={() => openModal("expense", exp)}
                                style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", padding: 4 }}
                            >
                                <Pencil style={{ width: 14, height: 14 }} />
                            </button>
                            <button
                                onClick={async () => {
                                    removeExpense(exp.id);
                                    try { await deleteExpenseApi(exp.id); } catch { /* already removed locally */ }
                                }}
                                disabled={isDeletingExpense}
                                style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: 4, opacity: isDeletingExpense ? 0.5 : 1 }}
                            >
                                <X style={{ width: 14, height: 14 }} />
                            </button>
                        </div>
                    </div>
                );
            })}

            <button
                onClick={() => openModal("expense")}
                style={{
                    width: "100%", padding: "12px", marginBottom: 32,
                    border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "transparent", color: "#94A3B8", fontSize: 14, fontWeight: 500,
                    cursor: "pointer", transition: "border-color 0.15s, color 0.15s",
                    boxSizing: "border-box",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(16,185,129,0.3)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#10B981";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
                }}
            >
                <Plus style={{ width: 18, height: 18 }} />
                Add Expense
            </button>

            {/* ── Cash Flow Summary Card ─────────────────────────────────────── */}
            {incomes.length > 0 && expenses.length > 0 && (
                <div style={{
                    background: "#0F172A", border: "2px solid rgba(16,185,129,0.2)",
                    borderRadius: 20, padding: 24, position: "relative", overflow: "hidden",
                    marginBottom: 16,
                }}>
                    {/* Top gradient bar */}
                    <div style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 4,
                        background: "linear-gradient(90deg, #10B981, #3B82F6)",
                    }} />

                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 12, marginBottom: 24, opacity: 0.8,
                    }}>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2))" }} />
                        <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#CBD5E1", textTransform: "uppercase", margin: 0 }}>
                            Your Monthly Cash Flow
                        </h3>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(270deg, transparent, rgba(255,255,255,0.2))" }} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: "monospace" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#CBD5E1", fontFamily: "sans-serif" }}>Income</span>
                            <span style={{ fontSize: 18, fontWeight: 700, color: "#10B981" }}>
                                ₹{totalMonthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#CBD5E1", fontFamily: "sans-serif" }}>Expenses</span>
                            <span style={{ fontSize: 18, fontWeight: 700, color: "#EF4444" }}>
                                -₹{nonEMIExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#94A3B8", fontFamily: "sans-serif" }}>EMIs (loans)</span>
                            <span style={{ fontWeight: 600, color: "#94A3B8" }}>
                                -₹{totalMonthlyEMIs.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                        </div>

                        <div style={{
                            borderTop: "1px dashed rgba(255,255,255,0.2)",
                            paddingTop: 16, marginTop: 4,
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                            <span style={{ fontSize: 18, fontWeight: 700, color: "#F1F5F9", fontFamily: "sans-serif" }}>
                                SURPLUS
                            </span>
                            <span style={{ fontSize: 20, fontWeight: 700, color: surplus >= 0 ? "#10B981" : "#EF4444" }}>
                                ₹{surplus.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#CBD5E1", fontFamily: "sans-serif" }}>Savings Rate</span>
                            <span style={{ fontSize: 18, fontWeight: 700, color: savingsRate >= 20 ? "#10B981" : "#EF4444" }}>
                                {savingsRate}%
                            </span>
                        </div>
                    </div>

                    <div style={{ marginTop: 24 }}>
                        {savingsRate >= 20 ? (
                            <div style={{
                                background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                                borderRadius: 12, padding: 16, display: "flex", alignItems: "flex-start", gap: 12,
                            }}>
                                <CheckCircle2 style={{ width: 18, height: 18, color: "#10B981", flexShrink: 0, marginTop: 2 }} />
                                <p style={{ fontSize: 14, color: "#10B981", fontWeight: 500, margin: 0 }}>
                                    Excellent! You&apos;re saving more than 70% of Indians.
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                                borderRadius: 12, padding: 16,
                            }}>
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: discretionaryList.length > 0 ? 12 : 0 }}>
                                    <span style={{ fontSize: 20, flexShrink: 0 }}>🚨</span>
                                    <p style={{ fontSize: 14, margin: 0 }}>
                                        <span style={{ fontWeight: 700, color: "#EF4444" }}>
                                            Your savings rate is below the recommended 20%.
                                        </span>
                                    </p>
                                </div>
                                {discretionaryList.length > 0 && (
                                    <div style={{ paddingLeft: 32 }}>
                                        <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>
                                            Review non-essential expenses like:
                                        </p>
                                        {discretionaryList.slice(0, 3).map((exp) => (
                                            <div key={exp.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "monospace", marginBottom: 4 }}>
                                                <span style={{ color: "#CBD5E1" }}>{exp.category}:</span>
                                                <span style={{ color: "#94A3B8" }}>
                                                    ₹{calculateMonthly(exp).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                                                </span>
                                            </div>
                                        ))}
                                        <p style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.8)", marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(239,68,68,0.2)" }}>
                                            Reducing these by 30% would boost savings to{" "}
                                            <span style={{ color: "#10B981", fontWeight: 700 }}>{hypotheticalSavingsRate}%</span>.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* EMI Mismatch Warning */}
            {emiMismatch && (
                <div style={{
                    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 12, padding: 16, display: "flex", alignItems: "flex-start", gap: 12,
                    marginBottom: 16,
                }}>
                    <AlertTriangle style={{ width: 18, height: 18, color: "#EF4444", flexShrink: 0, marginTop: 2 }} />
                    <div>
                        <h5 style={{ color: "#EF4444", fontWeight: 700, fontSize: 14, margin: "0 0 6px" }}>
                            ⚠️ EMI Mismatch Detected
                        </h5>
                        <p style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.6, margin: "0 0 8px" }}>
                            Your EMI expense here is{" "}
                            <span style={{ fontWeight: 700, color: "#F59E0B" }}>₹{totalMonthlyEMIs.toLocaleString()}/mo</span>,
                            but your <span style={{ fontWeight: 700, color: "#F1F5F9" }}>Liabilities</span> (Step 3)
                            add up to{" "}
                            <span style={{ fontWeight: 700, color: "#F59E0B" }}>₹{liabilitiesEMITotal.toLocaleString()}/mo</span>.
                        </p>
                        <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
                            Please update the EMI amount here or correct the EMI values in{" "}
                            <button
                                onClick={() => router.push("/assessment/step-3")}
                                style={{ background: "none", border: "none", color: "#10B981", fontWeight: 600, cursor: "pointer", textDecoration: "underline", fontSize: 12 }}
                            >
                                Liabilities (Step 3)
                            </button>{" "}
                            so both match.
                        </p>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <StepNavigation
                step={2}
                backPath="/assessment/step-1"
                onNext={() => {
                    if (totalMonthlyIncome === 0 && totalMonthlyExpenses === 0) {
                        toast.error("Add at least one income source and one expense to continue", { id: "step2-guide" });
                        return;
                    }
                    if (totalMonthlyIncome === 0) {
                        toast.error("Add your income sources — salary, freelance, or investments", { id: "step2-guide" });
                        return;
                    }
                    if (totalMonthlyExpenses === 0) {
                        toast("💡 Tip: Add your expenses for a better financial picture", { id: "step2-guide" });
                    }
                    router.push("/assessment/step-3");
                }}
                isValid={true}
            />

            {/* ── Modal ──────────────────────────────────────────────────────── */}
            {isModalOpen && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 50,
                    display: "flex", alignItems: "flex-end", justifyContent: "center",
                }}>
                    {/* Backdrop */}
                    <div
                        onClick={() => setIsModalOpen(false)}
                        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
                    />

                    {/* Sheet */}
                    <div style={{
                        position: "relative", background: "#0F172A", width: "100%", maxWidth: 512,
                        borderRadius: "24px 24px 0 0", padding: 24,
                        boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        maxHeight: "90vh", overflowY: "auto",
                    }}>
                        {/* Handle */}
                        <div style={{ width: 48, height: 4, background: "#1E293B", borderRadius: 99, margin: "0 auto 24px" }} />

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>
                                {editingId ? "Edit" : "Add"} {modalType === "income" ? "Income" : "Expense"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}
                            >
                                <X style={{ width: 22, height: 22 }} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {/* Category */}
                            <div>
                                <label style={labelStyle}>{modalType === "income" ? "Type of Income" : "Category"}</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={selectStyle}
                                >
                                    {modalType === "income" ? (
                                        <>
                                            <option>Salary</option>
                                            <option>Business Income</option>
                                            <option>Agriculture Income</option>
                                            <option>Freelancing</option>
                                            <option>Rental Income</option>
                                            <option>Dividend Income</option>
                                            <option>Interest Income</option>
                                            <option>Bonus/Incentive</option>
                                            <option>Capital Gains (from selling stocks/property)</option>
                                            <option>Pension</option>
                                            <option>Other</option>
                                        </>
                                    ) : (
                                        <>
                                            <option>Rent/Mortgage</option>
                                            <option>EMIs (loan payments)</option>
                                            <option>Utilities (electricity, water, gas)</option>
                                            <option>Transportation</option>
                                            <option>Food & Groceries</option>
                                            <option>Shopping (clothes, personal care)</option>
                                            <option>Entertainment (movies, dining out)</option>
                                            <option>Subscriptions (Netflix, gym, etc.)</option>
                                            <option>Healthcare</option>
                                            <option>Education</option>
                                            <option>Insurance Premiums</option>
                                            <option>Childcare</option>
                                            <option>Pet Care</option>
                                            <option>Travel & Vacations</option>
                                            <option>Gifts & Donations</option>
                                            <option>Other</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            {/* Amount */}
                            <div>
                                <label style={labelStyle}>Amount (₹)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    style={{ ...inputStyle, fontSize: 18, fontWeight: 700 }}
                                    placeholder="0"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label style={labelStyle}>Description (optional)</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={inputStyle}
                                    placeholder={modalType === "income" ? "e.g. Acme Corp salary" : "e.g. Home Loan EMI"}
                                    maxLength={100}
                                />
                            </div>

                            {/* Frequency + Type */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <label style={labelStyle}>Frequency</label>
                                    <select
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value)}
                                        style={selectStyle}
                                    >
                                        <option>Monthly</option>
                                        <option>Quarterly</option>
                                        <option>Yearly</option>
                                        <option>One-time</option>
                                    </select>
                                </div>
                                {modalType === "expense" && (
                                    <div>
                                        <label style={labelStyle}>Type</label>
                                        <div
                                            onClick={() => setIsEssential(!isEssential)}
                                            style={{
                                                height: 46, display: "flex", alignItems: "center",
                                                justifyContent: "space-between", padding: "0 12px",
                                                borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
                                                background: isEssential ? "rgba(16,185,129,0.1)" : "#0B0F1A",
                                                border: isEssential ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(255,255,255,0.1)",
                                            }}
                                        >
                                            <span style={{ fontSize: 14, color: isEssential ? "#10B981" : "#94A3B8", fontWeight: isEssential ? 500 : 400 }}>
                                                {isEssential ? "Essential" : "Discretionary"}
                                            </span>
                                            <div style={{
                                                width: 40, height: 20, borderRadius: 99, padding: 2,
                                                display: "flex", alignItems: "center",
                                                background: isEssential ? "#10B981" : "#1E293B",
                                                transition: "background 0.2s",
                                            }}>
                                                <div style={{
                                                    width: 16, height: 16, borderRadius: "50%", background: "#fff",
                                                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                                                    transform: isEssential ? "translateX(20px)" : "translateX(0)",
                                                    transition: "transform 0.2s",
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* TDS toggle (income only) */}
                            {modalType === "income" && (
                                <div style={{
                                    padding: 16, background: "rgba(16,185,129,0.05)",
                                    border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12,
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: 14, fontWeight: 500, color: "#F1F5F9" }}>Tax Already Deducted?</span>
                                        <div
                                            onClick={() => setTaxDeducted(!taxDeducted)}
                                            style={{
                                                width: 48, height: 24, borderRadius: 99, padding: 4,
                                                display: "flex", alignItems: "center",
                                                background: taxDeducted ? "#10B981" : "#1E293B",
                                                cursor: "pointer", transition: "background 0.2s",
                                            }}
                                        >
                                            <div style={{
                                                width: 16, height: 16, borderRadius: "50%", background: "#fff",
                                                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                                                transform: taxDeducted ? "translateX(24px)" : "translateX(0)",
                                                transition: "transform 0.2s",
                                            }} />
                                        </div>
                                    </div>
                                    {taxDeducted && (
                                        <div style={{ marginTop: 16 }}>
                                            <label style={labelStyle}>TDS Percentage (%)</label>
                                            <div style={{ position: "relative" }}>
                                                <input
                                                    type="number"
                                                    value={tdsPercentage}
                                                    onChange={(e) => setTdsPercentage(parseFloat(e.target.value))}
                                                    style={{ ...inputStyle, fontWeight: 700, paddingRight: 36 }}
                                                    placeholder="10"
                                                    min={0}
                                                    max={100}
                                                    step={0.1}
                                                />
                                                <span style={{
                                                    position: "absolute", right: 12, top: "50%",
                                                    transform: "translateY(-50%)", color: "#94A3B8", fontWeight: 700,
                                                }}>%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Save */}
                            <button
                                onClick={handleSave}
                                style={{
                                    width: "100%", padding: "16px", marginTop: 8,
                                    background: "#10B981", border: "none", borderRadius: 12,
                                    color: "#0B0F1A", fontWeight: 700, fontSize: 15,
                                    cursor: "pointer", boxShadow: "0 0 15px rgba(16,185,129,0.3)",
                                    transition: "opacity 0.15s",
                                }}
                            >
                                {editingId ? "Update" : "Save"} {modalType === "income" ? "Income" : "Expense"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
