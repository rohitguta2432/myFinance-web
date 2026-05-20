"use client";

import { useState, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAppTheme, type AppPalette } from "@/hooks/useAppTheme";
import {
    ArrowLeft,
    User,
    Wallet,
    Building2,
    Target,
    Shield,
    Receipt,
    CheckCircle2,
    Circle,
} from "lucide-react";

// ─── TYPES ───────────────────────────────────────────
interface Profile {
    id?: number;
    age?: number;
    state?: string;
    city?: string;
    maritalStatus?: string;
    dependents?: number;
    childDependents?: number;
    employmentType?: string;
    residencyStatus?: string;
    riskTolerance?: string;
    riskScore?: number;
    riskAnswers?: string;
}

interface Income {
    id?: number;
    sourceName?: string;
    amount?: number;
    frequency?: string;
    taxDeducted?: boolean;
    tdsPercentage?: number;
    description?: string;
}

interface Expense {
    id?: number;
    category?: string;
    amount?: number;
    frequency?: string;
    isEssential?: boolean;
    description?: string;
}

interface Asset {
    id?: number;
    assetType?: string;
    name?: string;
    currentValue?: number;
    allocationPercentage?: number;
    category?: string;
    timeHorizon?: string;
}

interface Liability {
    id?: number;
    liabilityType?: string;
    name?: string;
    outstandingAmount?: number;
    monthlyEmi?: number;
    interestRate?: number;
    monthsLeft?: number;
}

interface Goal {
    id?: number;
    goalType?: string;
    name?: string;
    targetAmount?: number;
    currentCost?: number;
    timeHorizonYears?: number;
    inflationRate?: number;
    currentSavings?: number;
    importance?: string;
}

interface Insurance {
    id?: number;
    insuranceType?: string;
    policyName?: string;
    coverageAmount?: number;
    premiumAmount?: number;
    renewalDate?: string;
}

interface Tax {
    id?: number;
    selectedRegime?: string;
    ppfElssAmount?: number;
    epfVpfAmount?: number;
    tuitionFeesAmount?: number;
    licPremiumAmount?: number;
    homeLoanPrincipal?: number;
    nscFdAmount?: number;
    healthInsurancePremium?: number;
    parentsHealthInsurance?: number;
    parentsHealthInsuranceSenior?: number;
    additionalNpsAmount?: number;
    homeLoanInterest?: number;
    educationLoanInterest?: number;
    donationsAmount?: number;
    calculatedTaxOld?: number;
    calculatedTaxNew?: number;
}

interface UserDetail {
    summary: {
        id: number;
        name: string;
        email: string;
        pictureUrl?: string;
        city?: string;
        state?: string;
        age?: number;
        createdAt: string;
        lastLoginAt?: string;
        netWorth: number;
        monthlyIncome: number;
        monthlyExpenses: number;
        savingsRate?: number;
        stepsCompleted: number;
    };
    hasProfile: boolean;
    hasCashFlow: boolean;
    hasNetWorth: boolean;
    hasGoals: boolean;
    hasInsurance: boolean;
    hasTax: boolean;
    totalAssets: number;
    totalLiabilities: number;
    emiToIncomeRatio?: number;
    termLifeCover: number;
    healthCover: number;
    profile?: Profile;
    incomes?: Income[];
    expenses?: Expense[];
    assets?: Asset[];
    liabilities?: Liability[];
    goalEntries?: Goal[];
    insurances?: Insurance[];
    tax?: Tax;
}

// ─── HELPERS ─────────────────────────────────────────
const ACCENT = "#10B981";
const FONT = "var(--font-display, 'DM Sans', sans-serif)";

const fmt = (v: number | null | undefined): string => {
    if (v == null || isNaN(v)) return "—";
    if (v === 0) return "₹0";
    const abs = Math.abs(v);
    const sign = v < 0 ? "-" : "";
    if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
    if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(2)} L`;
    if (abs >= 1000) return `${sign}₹${Math.round(abs).toLocaleString("en-IN")}`;
    return `${sign}₹${Math.round(abs)}`;
};

const fmtDate = (d: string | null | undefined): string =>
    d
        ? new Date(d).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "—";

const dash = (v: string | number | null | undefined): string =>
    v == null || v === "" ? "—" : String(v);

const yesNo = (v: boolean | null | undefined): string =>
    v == null ? "—" : v ? "Yes" : "No";

const titleCase = (s: string | null | undefined): string => {
    if (!s) return "—";
    return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

function tokens(p: AppPalette) {
    return {
        BG: p.bg,
        SURFACE: p.s1,
        SURFACE2: p.s2,
        BORDER: `1px solid ${p.brd}`,
        BORDER2: `1px solid ${p.brd2}`,
        TEXT: p.txt,
        TEXT2: p.txt2,
        MUTED: p.mute,
        DANGER: p.danger,
        WARN: p.warn,
    };
}

const fetchAdmin = (path: string) =>
    fetch(`/api/proxy${path}`, { credentials: "include" }).then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
    });

// ─── REUSABLE BITS ───────────────────────────────────
function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    const palette = useAppTheme();
    const { SURFACE, BORDER, TEXT, MUTED } = tokens(palette);
    return (
        <div style={{ background: SURFACE, border: BORDER, borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, letterSpacing: "-0.01em" }}>{title}</h3>
                {subtitle && <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}

function KV({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
    const palette = useAppTheme();
    const { TEXT2, MUTED } = tokens(palette);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 0", borderBottom: `1px solid ${palette.brd}` }}>
            <span style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</span>
            <span
                style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: highlight ? ACCENT : TEXT2,
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                {value}
            </span>
        </div>
    );
}

function DataTable({ columns, rows, emptyText }: { columns: string[]; rows: React.ReactNode[][]; emptyText: string }) {
    const palette = useAppTheme();
    const { TEXT2, MUTED, BORDER } = tokens(palette);
    if (rows.length === 0) {
        return (
            <div style={{ padding: 32, textAlign: "center", color: MUTED, fontSize: 13, border: `1px dashed ${palette.brd2}`, borderRadius: 12 }}>
                {emptyText}
            </div>
        );
    }
    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                    <tr style={{ borderBottom: BORDER }}>
                        {columns.map((c, i) => (
                            <th
                                key={i}
                                style={{
                                    textAlign: "left",
                                    padding: "10px 12px",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    color: MUTED,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {c}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, ri) => (
                        <tr key={ri} style={{ borderBottom: `1px solid ${palette.brd}` }}>
                            {row.map((cell, ci) => (
                                <td key={ci} style={{ padding: "12px", color: TEXT2, fontVariantNumeric: "tabular-nums" }}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── STEP PANELS ─────────────────────────────────────
function ProfilePanel({ data }: { data: UserDetail }) {
    const p = data.profile;
    if (!p) return <SectionCard title="Profile"><EmptyStep label="profile" /></SectionCard>;
    return (
        <SectionCard title="Profile" subtitle="Step 1 — Personal & demographic info">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 32px" }}>
                <KV label="Age" value={dash(p.age)} />
                <KV label="City" value={dash(p.city)} />
                <KV label="State" value={dash(p.state)} />
                <KV label="Marital Status" value={titleCase(p.maritalStatus)} />
                <KV label="Total Dependents" value={dash(p.dependents)} />
                <KV label="Child Dependents" value={dash(p.childDependents)} />
                <KV label="Employment Type" value={titleCase(p.employmentType)} />
                <KV label="Residency Status" value={titleCase(p.residencyStatus)} />
                <KV label="Risk Tolerance" value={titleCase(p.riskTolerance)} highlight={!!p.riskTolerance} />
                <KV label="Risk Score" value={dash(p.riskScore)} />
                <KV label="Risk Quiz Answers" value={p.riskAnswers || "—"} />
            </div>
        </SectionCard>
    );
}

function CashFlowPanel({ data }: { data: UserDetail }) {
    const incomes = data.incomes || [];
    const expenses = data.expenses || [];
    const palette = useAppTheme();
    const { TEXT2 } = tokens(palette);
    return (
        <>
            <SectionCard title={`Income Sources (${incomes.length})`} subtitle="Step 2 — All income line items">
                <DataTable
                    columns={["Source", "Amount", "Frequency", "TDS", "TDS %", "Description"]}
                    rows={incomes.map((i) => [
                        <strong key="n" style={{ color: TEXT2 }}>{dash(i.sourceName)}</strong>,
                        fmt(i.amount),
                        titleCase(i.frequency),
                        yesNo(i.taxDeducted),
                        i.tdsPercentage != null ? `${i.tdsPercentage}%` : "—",
                        dash(i.description),
                    ])}
                    emptyText="No incomes recorded."
                />
            </SectionCard>
            <SectionCard title={`Expenses (${expenses.length})`} subtitle="All expense line items">
                <DataTable
                    columns={["Category", "Amount", "Frequency", "Essential", "Description"]}
                    rows={expenses.map((e) => [
                        <strong key="c" style={{ color: TEXT2 }}>{dash(e.category)}</strong>,
                        fmt(e.amount),
                        titleCase(e.frequency),
                        yesNo(e.isEssential),
                        dash(e.description),
                    ])}
                    emptyText="No expenses recorded."
                />
            </SectionCard>
        </>
    );
}

function NetWorthPanel({ data }: { data: UserDetail }) {
    const assets = data.assets || [];
    const liabs = data.liabilities || [];
    const palette = useAppTheme();
    const { TEXT2 } = tokens(palette);
    return (
        <>
            <SectionCard title={`Assets (${assets.length})`} subtitle={`Step 3 — Total: ${fmt(data.totalAssets)}`}>
                <DataTable
                    columns={["Type", "Name", "Current Value", "Allocation %", "Category", "Horizon"]}
                    rows={assets.map((a) => [
                        <strong key="t" style={{ color: TEXT2 }}>{titleCase(a.assetType)}</strong>,
                        dash(a.name),
                        fmt(a.currentValue),
                        a.allocationPercentage != null ? `${a.allocationPercentage.toFixed(1)}%` : "—",
                        dash(a.category),
                        titleCase(a.timeHorizon),
                    ])}
                    emptyText="No assets recorded."
                />
            </SectionCard>
            <SectionCard title={`Liabilities (${liabs.length})`} subtitle={`Total: ${fmt(data.totalLiabilities)} — EMI/Income: ${data.emiToIncomeRatio?.toFixed(1) || 0}%`}>
                <DataTable
                    columns={["Type", "Name", "Outstanding", "Monthly EMI", "Interest %", "Months Left"]}
                    rows={liabs.map((l) => [
                        <strong key="t" style={{ color: TEXT2 }}>{titleCase(l.liabilityType)}</strong>,
                        dash(l.name),
                        fmt(l.outstandingAmount),
                        fmt(l.monthlyEmi),
                        l.interestRate != null ? `${l.interestRate}%` : "—",
                        dash(l.monthsLeft),
                    ])}
                    emptyText="No liabilities recorded."
                />
            </SectionCard>
        </>
    );
}

function GoalsPanel({ data }: { data: UserDetail }) {
    const goals = data.goalEntries || [];
    const palette = useAppTheme();
    const { TEXT2 } = tokens(palette);
    return (
        <SectionCard title={`Goals (${goals.length})`} subtitle="Step 4 — Financial goals with full parameters">
            <DataTable
                columns={["Type", "Name", "Target", "Current Cost", "Horizon", "Inflation %", "Current Savings", "Importance"]}
                rows={goals.map((g) => [
                    <strong key="t" style={{ color: TEXT2 }}>{titleCase(g.goalType)}</strong>,
                    dash(g.name),
                    fmt(g.targetAmount),
                    fmt(g.currentCost),
                    g.timeHorizonYears != null ? `${g.timeHorizonYears} yr` : "—",
                    g.inflationRate != null ? `${g.inflationRate}%` : "—",
                    fmt(g.currentSavings),
                    titleCase(g.importance),
                ])}
                emptyText="No goals recorded."
            />
        </SectionCard>
    );
}

function InsurancePanel({ data }: { data: UserDetail }) {
    const policies = data.insurances || [];
    const palette = useAppTheme();
    const { TEXT2 } = tokens(palette);
    return (
        <SectionCard
            title={`Insurance Policies (${policies.length})`}
            subtitle={`Step 5 — Term life: ${fmt(data.termLifeCover)}  ·  Health: ${fmt(data.healthCover)}`}
        >
            <DataTable
                columns={["Type", "Policy Name", "Coverage", "Annual Premium", "Renewal Date"]}
                rows={policies.map((i) => [
                    <strong key="t" style={{ color: TEXT2 }}>{titleCase(i.insuranceType)}</strong>,
                    dash(i.policyName),
                    fmt(i.coverageAmount),
                    fmt(i.premiumAmount),
                    dash(i.renewalDate),
                ])}
                emptyText="No insurance policies recorded."
            />
        </SectionCard>
    );
}

function TaxPanel({ data }: { data: UserDetail }) {
    const t = data.tax;
    if (!t) return <SectionCard title="Tax"><EmptyStep label="tax data" /></SectionCard>;

    const sec80c =
        (t.ppfElssAmount || 0) +
        (t.epfVpfAmount || 0) +
        (t.tuitionFeesAmount || 0) +
        (t.licPremiumAmount || 0) +
        (t.homeLoanPrincipal || 0) +
        (t.nscFdAmount || 0);
    const sec80d = (t.healthInsurancePremium || 0) + (t.parentsHealthInsurance || 0) + (t.parentsHealthInsuranceSenior || 0);
    const taxSaved =
        t.calculatedTaxOld != null && t.calculatedTaxNew != null
            ? Math.abs(t.calculatedTaxOld - t.calculatedTaxNew)
            : 0;

    return (
        <>
            <SectionCard title="Tax Plan Overview" subtitle="Step 6 — Selected regime & calculated liability">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 32px" }}>
                    <KV label="Selected Regime" value={titleCase(t.selectedRegime)} highlight />
                    <KV label="Tax (Old Regime)" value={fmt(t.calculatedTaxOld)} />
                    <KV label="Tax (New Regime)" value={fmt(t.calculatedTaxNew)} />
                    <KV label="Tax Saved" value={fmt(taxSaved)} highlight={taxSaved > 0} />
                </div>
            </SectionCard>

            <SectionCard title="Section 80C Investments" subtitle={`Combined cap ₹1.5L  ·  Total: ${fmt(sec80c)}`}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 32px" }}>
                    <KV label="PPF / ELSS" value={fmt(t.ppfElssAmount)} />
                    <KV label="EPF / VPF" value={fmt(t.epfVpfAmount)} />
                    <KV label="Tuition Fees" value={fmt(t.tuitionFeesAmount)} />
                    <KV label="LIC Premium" value={fmt(t.licPremiumAmount)} />
                    <KV label="Home Loan Principal" value={fmt(t.homeLoanPrincipal)} />
                    <KV label="NSC / Tax FD" value={fmt(t.nscFdAmount)} />
                </div>
            </SectionCard>

            <SectionCard title="Section 80D — Medical Insurance" subtitle={`Total: ${fmt(sec80d)}`}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 32px" }}>
                    <KV label="Self + Spouse (₹25K cap)" value={fmt(t.healthInsurancePremium)} />
                    <KV label="Parents <60 (₹25K cap)" value={fmt(t.parentsHealthInsurance)} />
                    <KV label="Parents ≥60 (₹50K cap)" value={fmt(t.parentsHealthInsuranceSenior)} />
                </div>
            </SectionCard>

            <SectionCard title="Other Deductions">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0 32px" }}>
                    <KV label="Additional NPS — 80CCD(1B), ₹50K cap" value={fmt(t.additionalNpsAmount)} />
                    <KV label="Home Loan Interest — 24(b), ₹2L cap" value={fmt(t.homeLoanInterest)} />
                    <KV label="Education Loan Interest — 80E" value={fmt(t.educationLoanInterest)} />
                    <KV label="Donations — 80G" value={fmt(t.donationsAmount)} />
                </div>
            </SectionCard>
        </>
    );
}

function EmptyStep({ label }: { label: string }) {
    const palette = useAppTheme();
    const { MUTED } = tokens(palette);
    return (
        <div style={{ padding: 40, textAlign: "center", color: MUTED, fontSize: 13, border: `1px dashed ${palette.brd2}`, borderRadius: 12 }}>
            User has not filled in {label} yet.
        </div>
    );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
    const palette = useAppTheme();
    const { MUTED } = tokens(palette);
    return (
        <div style={{ minWidth: 84 }}>
            <p style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{label}</p>
            <p style={{ fontSize: 18, fontWeight: 700, color, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>{value}</p>
        </div>
    );
}

// ─── PAGE ────────────────────────────────────────────
const STEPS = [
    { id: "profile", label: "Profile", Icon: User, key: "hasProfile" as const },
    { id: "cashflow", label: "Cash Flow", Icon: Wallet, key: "hasCashFlow" as const },
    { id: "networth", label: "Net Worth", Icon: Building2, key: "hasNetWorth" as const },
    { id: "goals", label: "Goals", Icon: Target, key: "hasGoals" as const },
    { id: "insurance", label: "Insurance", Icon: Shield, key: "hasInsurance" as const },
    { id: "tax", label: "Tax", Icon: Receipt, key: "hasTax" as const },
];

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const palette = useAppTheme();
    const { BG, SURFACE, BORDER, TEXT, TEXT2, MUTED } = tokens(palette);
    const [activeStep, setActiveStep] = useState<string>("profile");

    const { data, isLoading, isError } = useQuery<UserDetail>({
        queryKey: ["admin-user-detail-full", id],
        queryFn: () => fetchAdmin(`/admin/users/${id}`),
    });

    const wrap: React.CSSProperties = {
        minHeight: "100vh",
        background: BG,
        fontFamily: FONT,
        color: TEXT,
        padding: "24px 32px",
    };

    if (isError) {
        return (
            <div style={wrap}>
                <p style={{ color: palette.danger }}>Failed to load user. Check your session and try again.</p>
                <button onClick={() => router.back()} style={{ marginTop: 12, padding: "8px 14px", borderRadius: 10, background: palette.s2, border: `1px solid ${palette.brd2}`, color: TEXT, cursor: "pointer", fontFamily: FONT }}>
                    Go Back
                </button>
            </div>
        );
    }

    if (isLoading || !data) {
        return (
            <div style={wrap}>
                <div style={{ height: 80, background: SURFACE, borderRadius: 16, marginBottom: 16 }} />
                <div style={{ height: 56, background: SURFACE, borderRadius: 12, marginBottom: 16 }} />
                <div style={{ height: 360, background: SURFACE, borderRadius: 16 }} />
            </div>
        );
    }

    return (
        <div style={wrap}>
            {/* Top bar — back button */}
            <button
                onClick={() => router.push("/admin")}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 10,
                    background: "transparent",
                    border: `1px solid ${palette.brd2}`,
                    color: MUTED,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginBottom: 20,
                    fontFamily: FONT,
                }}
            >
                <ArrowLeft size={14} /> Back to Admin
            </button>

            {/* Identity header */}
            <div style={{ background: SURFACE, border: BORDER, borderRadius: 16, padding: 24, marginBottom: 20 }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
                    <img
                        src={
                            data.summary.pictureUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(data.summary.name || "U")}&background=10B981&color=fff&size=64`
                        }
                        alt=""
                        style={{ width: 64, height: 64, borderRadius: "50%", flexShrink: 0 }}
                    />
                    <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                        <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT, letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.summary.name}</h1>
                        <p style={{ fontSize: 13, color: MUTED, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.summary.email}</p>
                    </div>
                    <div style={{ display: "flex", gap: 24, flexShrink: 0, flexWrap: "wrap" }}>
                        <Stat label="Net Worth" value={fmt(data.summary.netWorth)} color={TEXT} />
                        <Stat label="Income/mo" value={fmt(data.summary.monthlyIncome)} color={TEXT2} />
                        <Stat label="Savings %" value={`${data.summary.savingsRate?.toFixed(0) || 0}%`} color={ACCENT} />
                    </div>
                </div>
                {/* Meta tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                    {data.summary.city && (
                        <span style={{ fontSize: 12, color: MUTED, padding: "4px 10px", borderRadius: 8, background: palette.s2 }}>
                            {data.summary.city}, {data.summary.state}
                        </span>
                    )}
                    {data.summary.age && (
                        <span style={{ fontSize: 12, color: MUTED, padding: "4px 10px", borderRadius: 8, background: palette.s2 }}>
                            Age {data.summary.age}
                        </span>
                    )}
                    <span style={{ fontSize: 12, color: MUTED, padding: "4px 10px", borderRadius: 8, background: palette.s2 }}>
                        Joined {fmtDate(data.summary.createdAt)}
                    </span>
                    <span
                        style={{
                            fontSize: 12,
                            padding: "4px 10px",
                            borderRadius: 8,
                            background: data.summary.stepsCompleted === 6 ? `${ACCENT}18` : palette.s2,
                            color: data.summary.stepsCompleted === 6 ? ACCENT : MUTED,
                            fontWeight: 700,
                        }}
                    >
                        {data.summary.stepsCompleted}/6 steps
                    </span>
                </div>
            </div>

            {/* Step tabs */}
            <div
                style={{
                    display: "flex",
                    gap: 4,
                    background: SURFACE,
                    border: BORDER,
                    borderRadius: 14,
                    padding: 6,
                    marginBottom: 20,
                    overflowX: "auto",
                }}
            >
                {STEPS.map(({ id: stepId, label, Icon, key }) => {
                    const active = activeStep === stepId;
                    const filled = !!data[key];
                    return (
                        <button
                            key={stepId}
                            onClick={() => setActiveStep(stepId)}
                            style={{
                                flex: "1 1 auto",
                                minWidth: 110,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 6,
                                padding: "10px 12px",
                                borderRadius: 10,
                                border: "none",
                                background: active ? `${ACCENT}18` : "transparent",
                                color: active ? ACCENT : MUTED,
                                fontWeight: active ? 700 : 500,
                                fontSize: 13,
                                cursor: "pointer",
                                fontFamily: FONT,
                                transition: "all 0.15s",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <Icon size={15} />
                            {label}
                            {filled ? (
                                <CheckCircle2 size={14} color={active ? ACCENT : palette.accent} style={{ opacity: active ? 1 : 0.5 }} />
                            ) : (
                                <Circle size={14} style={{ opacity: 0.35 }} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Active step content */}
            {activeStep === "profile" && <ProfilePanel data={data} />}
            {activeStep === "cashflow" && <CashFlowPanel data={data} />}
            {activeStep === "networth" && <NetWorthPanel data={data} />}
            {activeStep === "goals" && <GoalsPanel data={data} />}
            {activeStep === "insurance" && <InsurancePanel data={data} />}
            {activeStep === "tax" && <TaxPanel data={data} />}
        </div>
    );
}
