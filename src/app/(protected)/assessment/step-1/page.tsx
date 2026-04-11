"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Minus,
    Plus,
    ChevronDown,
    CheckCircle,
    CheckCircle2,
    Circle,
    Loader2,
    MapPin,
    Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useProfileQuery, useProfileMutation } from "@/hooks/assessment/useProfile";
import { StepNavigation } from "@/components/assessment/step-navigation";

// ─── Risk Questions ───────────────────────────────────────────────────────────

const QUESTIONS = [
    {
        id: 1,
        text: "Your ₹1 lakh investment drops to ₹80,000 in a month. What do you do?",
        options: [
            { id: "sell", text: "I sell everything and move it to FD or savings", score: 1 },
            { id: "hold", text: "I do nothing and wait for it to come back", score: 2 },
            { id: "buy", text: "I invest more while prices are cheap", score: 3 },
        ],
    },
    {
        id: 2,
        text: "When are you most likely to need the money you are investing today?",
        options: [
            { id: "short", text: "Within the next 3 years", score: 1 },
            { id: "medium", text: "In 3 to 7 years", score: 2 },
            { id: "long", text: "7 or more years from now", score: 3 },
        ],
    },
    {
        id: 3,
        text: "If you had ₹5 lakhs to invest today, what matters most to you?",
        options: [
            { id: "safety", text: "That I don't lose any of it — growth can wait", score: 1 },
            { id: "balanced", text: "Some growth is fine, but I don't want big swings", score: 2 },
            { id: "growth", text: "Maximum growth, even if it means big ups and downs", score: 3 },
        ],
    },
    {
        id: 4,
        text: "Imagine your portfolio crashes 40% in a recession. What do you do?",
        options: [
            { id: "exit", text: "I exit completely — I can't handle this", score: 1 },
            { id: "wait", text: "I stay put and wait for recovery", score: 2 },
            { id: "invest", text: "I see this as a buying opportunity and invest more", score: 3 },
        ],
    },
    {
        id: 5,
        text: "You're offered: A guaranteed 7% return, or a chance at 15% but could be −5%. Pick one.",
        options: [
            { id: "guaranteed", text: "Give me the guaranteed 7%", score: 1 },
            { id: "split", text: "I'd split — some safe, some risky", score: 2 },
            { id: "chance", text: "I'll take the 15% chance — I can handle a bad year", score: 3 },
        ],
    },
    {
        id: 6,
        text: "If your EMI increases and money gets tight, what do you cut first?",
        options: [
            { id: "investments", text: "My investments — safety first", score: 1 },
            { id: "adjust", text: "I adjust both lifestyle and investments", score: 2 },
            { id: "keep", text: "I don't touch my investments — I find other ways", score: 3 },
        ],
    },
    {
        id: 7,
        text: "Would you be comfortable putting money in crypto or startups?",
        options: [
            { id: "no", text: "Absolutely not — too risky", score: 1 },
            { id: "small", text: "Maybe a small percentage", score: 2 },
            { id: "yes", text: "Yes, I like high-risk high-reward bets", score: 3 },
        ],
    },
];

// ─── Inline Style Constants ───────────────────────────────────────────────────

const card: React.CSSProperties = {
    background: "#0F172A",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 20,
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    background: "rgba(15,23,42,0.6)",
    border: "1px solid #1E293B",
    borderRadius: 8,
    color: "#F1F5F9",
    fontSize: 14,
    outline: "none",
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

export default function Step1Page() {
    const router = useRouter();
    const {
        age, setAge,
        state, setState,
        city, setCity,
        maritalStatus, setMaritalStatus,
        dependents, setDependents,
        childDependents, setChildDependents,
        employmentType, setEmploymentType,
        residencyStatus, setResidencyStatus,
        riskAnswers, setRiskAnswer,
        riskTolerance,
    } = useAssessmentStore();

    const { data: profileData, isLoading: isFetching } = useProfileQuery();
    const { mutateAsync: saveProfileApi, isPending: isSaving } = useProfileMutation();

    // Hydrate Zustand from API
    useEffect(() => {
        if (profileData) {
            if (profileData.age) setAge(profileData.age);
            if (profileData.state) setState(profileData.state);
            if (profileData.city) setCity(profileData.city);
            if (profileData.maritalStatus) setMaritalStatus(profileData.maritalStatus);
            if (profileData.dependents !== undefined) setDependents(profileData.dependents);
            if (profileData.childDependents !== undefined) setChildDependents(profileData.childDependents);
            if (profileData.employmentType) setEmploymentType(profileData.employmentType);
            if (profileData.residencyStatus) setResidencyStatus(profileData.residencyStatus);
            if (profileData.riskAnswers) {
                Object.entries(profileData.riskAnswers).forEach(([qId, score]) => {
                    setRiskAnswer(parseInt(qId), score as number);
                });
            }
        }
    }, [profileData, setAge, setState, setCity, setMaritalStatus, setDependents, setChildDependents, setEmploymentType, setResidencyStatus, setRiskAnswer]);

    // Reset childDependents if dependents drops below it
    useEffect(() => {
        if (childDependents > dependents) {
            setChildDependents(Math.max(0, dependents));
        }
    }, [dependents, childDependents, setChildDependents]);

    // Dropdown state
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Location data
    const [statesList, setStatesList] = useState<string[]>([]);
    const [citiesList, setCitiesList] = useState<string[]>([]);
    const [stateSearch, setStateSearch] = useState("");
    const [citySearch, setCitySearch] = useState("");
    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const stateSearchRef = useRef<HTMLInputElement>(null);
    const citySearchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLoadingStates(true);
        fetch("/api/proxy/location/states")
            .then((res) => res.json())
            .then((data) => setStatesList(data || []))
            .catch((err) => console.error("Failed to load states:", err))
            .finally(() => setLoadingStates(false));
    }, []);

    useEffect(() => {
        if (!state) {
            setCitiesList([]);
            return;
        }
        setLoadingCities(true);
        fetch(`/api/proxy/location/cities?state=${encodeURIComponent(state)}`)
            .then((res) => res.json())
            .then((data) => setCitiesList(data || []))
            .catch((err) => console.error("Failed to load cities:", err))
            .finally(() => setLoadingCities(false));
    }, [state]);

    useEffect(() => {
        if (openDropdown === "state") stateSearchRef.current?.focus();
        if (openDropdown === "city") citySearchRef.current?.focus();
    }, [openDropdown]);

    const filteredStates = statesList.filter((s) =>
        s.toLowerCase().includes(stateSearch.toLowerCase())
    );
    const filteredCities = citiesList.filter((c) =>
        c.toLowerCase().includes(citySearch.toLowerCase())
    );

    // Risk questionnaire
    const [expandedQuestion, setExpandedQuestion] = useState(1);

    const allRiskAnswered = Object.keys(riskAnswers).length === 7;

    const handleRiskAnswer = useCallback(
        (qId: number, score: number) => {
            setRiskAnswer(qId, score);
            if (qId < QUESTIONS.length) {
                setTimeout(() => setExpandedQuestion(qId + 1), 300);
            }
        },
        [setRiskAnswer]
    );

    const isFormValid = useMemo(() => {
        return (
            age &&
            parseInt(String(age)) >= 18 &&
            state.trim() !== "" &&
            city.trim() !== "" &&
            maritalStatus !== "" &&
            employmentType !== "" &&
            residencyStatus !== "" &&
            allRiskAnswered
        );
    }, [age, state, city, maritalStatus, employmentType, residencyStatus, allRiskAnswered]);

    const handleNext = async () => {
        try {
            await saveProfileApi({
                age,
                state,
                city,
                maritalStatus,
                dependents,
                childDependents,
                employmentType,
                residencyStatus,
                riskAnswers,
                riskTolerance,
            });
        } catch (err) {
            console.warn("API save failed, continuing with local data:", err);
        }
        router.push("/assessment/step-2");
    };

    // Loading skeleton
    if (isFetching) {
        return (
            <div style={{ padding: "24px 24px 120px", maxWidth: 800, margin: "0 auto" }}>
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        style={{
                            ...card,
                            marginBottom: 16,
                            height: 120,
                            background: "linear-gradient(90deg, #0F172A 25%, #1E293B 50%, #0F172A 75%)",
                            backgroundSize: "200% 100%",
                            animation: "shimmer 1.5s infinite",
                        }}
                    />
                ))}
                <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px 24px 120px", maxWidth: 800, margin: "0 auto" }}>

            {/* ── Section A: Personal Profile ────────────────────────────────── */}
            <section style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                    <span style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: 24, height: 24, borderRadius: "50%",
                        background: "rgba(16,185,129,0.2)", color: "#10B981",
                        fontSize: 12, fontWeight: 700, border: "1px solid rgba(16,185,129,0.3)",
                    }}>A</span>
                    <h3 style={{ color: "#F1F5F9", fontSize: 18, fontWeight: 700, margin: 0 }}>
                        Personal Profile
                    </h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>

                    {/* Age Slider */}
                    <div style={card}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <label style={labelStyle}>
                                Your Age <span style={{ color: "#EF4444" }}>*</span>
                            </label>
                            <span style={{ fontSize: 24, fontFamily: "monospace", fontWeight: 700, color: "#10B981" }}>
                                {age}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={18}
                            max={75}
                            value={age}
                            onChange={(e) => setAge(parseInt(e.target.value))}
                            style={{ width: "100%", accentColor: "#10B981" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                            <span style={{ fontSize: 11, color: "#64748B" }}>18</span>
                            <span style={{ fontSize: 11, color: "#64748B" }}>75+</span>
                        </div>
                    </div>

                    {/* State & City */}
                    <div style={card}>
                        <label style={labelStyle}>
                            Location <span style={{ color: "#EF4444" }}>*</span>
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                            {/* State */}
                            <div style={{ position: "relative" }}>
                                <div
                                    onClick={() => setOpenDropdown(openDropdown === "state" ? null : "state")}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                                        background: "rgba(15,23,42,0.6)",
                                        border: state ? "1px solid rgba(16,185,129,0.3)" : "1px solid #1E293B",
                                        color: state ? "#F1F5F9" : "#64748B", fontSize: 14,
                                    }}
                                >
                                    <MapPin style={{ width: 14, height: 14, color: "#64748B", flexShrink: 0 }} />
                                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {state || "Select State..."}
                                    </span>
                                    <ChevronDown style={{
                                        width: 14, height: 14, color: "#94A3B8", flexShrink: 0,
                                        transform: openDropdown === "state" ? "rotate(180deg)" : "none",
                                        transition: "transform 0.2s",
                                    }} />
                                </div>

                                {openDropdown === "state" && (
                                    <div style={{
                                        position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8,
                                        background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                                        zIndex: 30, overflow: "hidden",
                                    }}>
                                        <div style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                            <div style={{ position: "relative" }}>
                                                <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, color: "#64748B" }} />
                                                <input
                                                    ref={stateSearchRef}
                                                    type="text"
                                                    value={stateSearch}
                                                    onChange={(e) => setStateSearch(e.target.value)}
                                                    placeholder="Search states..."
                                                    style={{ ...inputStyle, paddingLeft: 28, fontSize: 12 }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ maxHeight: 192, overflowY: "auto" }}>
                                            {loadingStates ? (
                                                <div style={{ padding: 12, textAlign: "center", color: "#64748B", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                                    <Loader2 style={{ width: 12, height: 12 }} /> Loading...
                                                </div>
                                            ) : filteredStates.length === 0 ? (
                                                <div style={{ padding: 12, textAlign: "center", color: "#64748B", fontSize: 12 }}>
                                                    No states found
                                                </div>
                                            ) : filteredStates.map((s) => (
                                                <div
                                                    key={s}
                                                    onClick={() => {
                                                        setState(s);
                                                        setCity("");
                                                        setStateSearch("");
                                                        setOpenDropdown(null);
                                                    }}
                                                    style={{
                                                        padding: "10px 12px", fontSize: 13, cursor: "pointer",
                                                        background: state === s ? "rgba(16,185,129,0.1)" : "transparent",
                                                        color: state === s ? "#10B981" : "#CBD5E1",
                                                        fontWeight: state === s ? 600 : 400,
                                                        transition: "background 0.1s",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (state !== s) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (state !== s) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                                                    }}
                                                >
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* City */}
                            <div style={{ position: "relative" }}>
                                <div
                                    onClick={() => {
                                        if (!state) {
                                            toast.error("Please select a state first", { id: "state-first" });
                                            return;
                                        }
                                        setOpenDropdown(openDropdown === "city" ? null : "city");
                                    }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "10px 12px", borderRadius: 8,
                                        cursor: !state ? "not-allowed" : "pointer",
                                        opacity: !state ? 0.5 : 1,
                                        background: "rgba(15,23,42,0.6)",
                                        border: city ? "1px solid rgba(16,185,129,0.3)" : "1px solid #1E293B",
                                        color: city ? "#F1F5F9" : "#64748B", fontSize: 14,
                                    }}
                                >
                                    <MapPin style={{ width: 14, height: 14, color: "#64748B", flexShrink: 0 }} />
                                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {city || "Select City..."}
                                    </span>
                                    <ChevronDown style={{
                                        width: 14, height: 14, color: "#94A3B8", flexShrink: 0,
                                        transform: openDropdown === "city" ? "rotate(180deg)" : "none",
                                        transition: "transform 0.2s",
                                    }} />
                                </div>

                                {openDropdown === "city" && state && (
                                    <div style={{
                                        position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8,
                                        background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                                        zIndex: 30, overflow: "hidden",
                                    }}>
                                        <div style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                            <div style={{ position: "relative" }}>
                                                <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, color: "#64748B" }} />
                                                <input
                                                    ref={citySearchRef}
                                                    type="text"
                                                    value={citySearch}
                                                    onChange={(e) => setCitySearch(e.target.value)}
                                                    placeholder="Search cities..."
                                                    style={{ ...inputStyle, paddingLeft: 28, fontSize: 12 }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ maxHeight: 192, overflowY: "auto" }}>
                                            {loadingCities ? (
                                                <div style={{ padding: 12, textAlign: "center", color: "#64748B", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                                    <Loader2 style={{ width: 12, height: 12 }} /> Loading...
                                                </div>
                                            ) : filteredCities.length === 0 ? (
                                                <div style={{ padding: 12, textAlign: "center", color: "#64748B", fontSize: 12 }}>
                                                    No cities found
                                                </div>
                                            ) : filteredCities.map((c) => (
                                                <div
                                                    key={c}
                                                    onClick={() => {
                                                        setCity(c);
                                                        setCitySearch("");
                                                        setOpenDropdown(null);
                                                    }}
                                                    style={{
                                                        padding: "10px 12px", fontSize: 13, cursor: "pointer",
                                                        background: city === c ? "rgba(16,185,129,0.1)" : "transparent",
                                                        color: city === c ? "#10B981" : "#CBD5E1",
                                                        fontWeight: city === c ? 600 : 400,
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (city !== c) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (city !== c) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                                                    }}
                                                >
                                                    {c}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Marital Status */}
                    <div style={card}>
                        <label style={labelStyle}>
                            Marital Status <span style={{ color: "#EF4444" }}>*</span>
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {["Single", "Married", "Divorced", "Widowed"].map((status) => {
                                const isActive = maritalStatus === status.toLowerCase();
                                return (
                                    <button
                                        key={status}
                                        onClick={() => setMaritalStatus(status.toLowerCase())}
                                        style={{
                                            padding: "10px 12px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                                            cursor: "pointer", transition: "all 0.15s", border: "1px solid transparent",
                                            background: isActive ? "#10B981" : "#1E293B",
                                            color: isActive ? "#0B0F1A" : "#CBD5E1",
                                            boxShadow: isActive ? "0 0 15px rgba(16,185,129,0.3)" : "none",
                                        }}
                                    >
                                        {status}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dependents */}
                    <div style={card}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <label style={labelStyle}>Dependents</label>
                                <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>Parents, children, spouse</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#1E293B", borderRadius: 8, padding: 4 }}>
                                <button
                                    onClick={() => setDependents(Math.max(0, dependents - 1))}
                                    style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, background: "#0B0F1A", border: "none", color: "#94A3B8", cursor: "pointer" }}
                                >
                                    <Minus style={{ width: 14, height: 14 }} />
                                </button>
                                <span style={{ width: 20, textAlign: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 18, color: "#F1F5F9" }}>
                                    {dependents}
                                </span>
                                <button
                                    onClick={() => setDependents(dependents + 1)}
                                    style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, background: "#0B0F1A", border: "none", color: "#10B981", cursor: "pointer" }}
                                >
                                    <Plus style={{ width: 14, height: 14 }} />
                                </button>
                            </div>
                        </div>

                        {dependents >= 1 && (
                            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <label style={labelStyle}>How many are children?</label>
                                    <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>Under 18 years old</p>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#1E293B", borderRadius: 8, padding: 4 }}>
                                    <button
                                        onClick={() => setChildDependents(Math.max(0, childDependents - 1))}
                                        style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, background: "#0B0F1A", border: "none", color: "#94A3B8", cursor: "pointer" }}
                                    >
                                        <Minus style={{ width: 14, height: 14 }} />
                                    </button>
                                    <span style={{ width: 20, textAlign: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 18, color: "#F1F5F9" }}>
                                        {childDependents}
                                    </span>
                                    <button
                                        onClick={() => setChildDependents(Math.min(dependents, childDependents + 1))}
                                        style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6, background: "#0B0F1A", border: "none", color: "#10B981", cursor: "pointer" }}
                                    >
                                        <Plus style={{ width: 14, height: 14 }} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Employment & Residency */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>

                    {/* Employment */}
                    <div style={{ position: "relative" }}>
                        <div
                            onClick={() => setOpenDropdown(openDropdown === "employment" ? null : "employment")}
                            style={{ ...card, cursor: "pointer", padding: "16px" }}
                        >
                            <label style={labelStyle}>
                                Employment <span style={{ color: "#EF4444" }}>*</span>
                            </label>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 14, fontWeight: 500, color: employmentType ? "#F1F5F9" : "#64748B" }}>
                                    {employmentType || "Select..."}
                                </span>
                                <ChevronDown style={{ width: 14, height: 14, color: "#94A3B8" }} />
                            </div>
                        </div>
                        {openDropdown === "employment" && (
                            <div style={{
                                position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8,
                                background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", zIndex: 20, overflow: "hidden",
                            }}>
                                {["Salaried", "Self-Employed", "Business", "Retired", "Unemployed"].map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => { setEmploymentType(type); setOpenDropdown(null); }}
                                        style={{
                                            padding: "12px", fontSize: 14, cursor: "pointer",
                                            background: employmentType === type ? "rgba(16,185,129,0.1)" : "transparent",
                                            color: employmentType === type ? "#10B981" : "#CBD5E1",
                                            fontWeight: employmentType === type ? 600 : 400,
                                        }}
                                        onMouseEnter={(e) => {
                                            if (employmentType !== type) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (employmentType !== type) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                                        }}
                                    >
                                        {type}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Residency */}
                    <div style={{ position: "relative" }}>
                        <div
                            onClick={() => setOpenDropdown(openDropdown === "residency" ? null : "residency")}
                            style={{ ...card, cursor: "pointer", padding: "16px" }}
                        >
                            <label style={labelStyle}>
                                Residency <span style={{ color: "#EF4444" }}>*</span>
                            </label>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 14, fontWeight: 500, color: residencyStatus ? "#F1F5F9" : "#64748B" }}>
                                    {residencyStatus || "Select..."}
                                </span>
                                <ChevronDown style={{ width: 14, height: 14, color: "#94A3B8" }} />
                            </div>
                        </div>
                        {openDropdown === "residency" && (
                            <div style={{
                                position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8,
                                background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", zIndex: 20, overflow: "hidden",
                            }}>
                                {["Resident", "NRI", "OCI"].map((status) => (
                                    <div
                                        key={status}
                                        onClick={() => { setResidencyStatus(status); setOpenDropdown(null); }}
                                        style={{
                                            padding: "12px", fontSize: 14, cursor: "pointer",
                                            background: residencyStatus === status ? "rgba(16,185,129,0.1)" : "transparent",
                                            color: residencyStatus === status ? "#10B981" : "#CBD5E1",
                                            fontWeight: residencyStatus === status ? 600 : 400,
                                        }}
                                        onMouseEnter={(e) => {
                                            if (residencyStatus !== status) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                                        }}
                                        onMouseLeave={(e) => {
                                            if (residencyStatus !== status) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                                        }}
                                    >
                                        {status}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "8px 0 32px" }} />

            {/* ── Section B: Investor Style ──────────────────────────────────── */}
            <section>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: 24, height: 24, borderRadius: "50%",
                        background: "rgba(16,185,129,0.2)", color: "#10B981",
                        fontSize: 12, fontWeight: 700, border: "1px solid rgba(16,185,129,0.3)",
                    }}>B</span>
                    <h3 style={{ color: "#F1F5F9", fontSize: 18, fontWeight: 700, margin: 0 }}>
                        Know Your Investor Style
                    </h3>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#10B981", marginBottom: 4 }}>
                    7 questions · Your profile tells us exactly how much risk your mind and your finances can handle.
                </p>
                <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 24, lineHeight: 1.6 }}>
                    So your money is always working in a way you&apos;re genuinely comfortable with.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {QUESTIONS.map((q) => {
                        const isAnswered = riskAnswers[q.id] !== undefined;
                        const selectedScore = riskAnswers[q.id];
                        const isExpanded = expandedQuestion === q.id;

                        return (
                            <div
                                key={q.id}
                                style={{
                                    background: "#0F172A",
                                    border: isAnswered && !isExpanded
                                        ? "1px solid rgba(16,185,129,0.2)"
                                        : "1px solid rgba(255,255,255,0.05)",
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    transition: "border-color 0.2s",
                                }}
                            >
                                {isExpanded ? (
                                    // Expanded
                                    <div>
                                        <div style={{
                                            padding: "16px",
                                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                                            background: "rgba(255,255,255,0.02)",
                                        }}>
                                            <p style={{ fontSize: 14, fontWeight: 500, color: "#F1F5F9", lineHeight: 1.6, margin: 0 }}>
                                                <span style={{ color: "#10B981", fontWeight: 700, marginRight: 6 }}>Q{q.id}.</span>
                                                {q.text}
                                            </p>
                                        </div>
                                        <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                                            {q.options.map((opt) => {
                                                const isSelected = selectedScore === opt.score;
                                                return (
                                                    <div
                                                        key={opt.id}
                                                        onClick={() => handleRiskAnswer(q.id, opt.score)}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: 12,
                                                            padding: "12px", borderRadius: 8, cursor: "pointer",
                                                            border: isSelected ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent",
                                                            background: isSelected ? "rgba(16,185,129,0.1)" : "transparent",
                                                            transition: "all 0.15s",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                                                            border: isSelected ? "2px solid #10B981" : "2px solid #475569",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                        }}>
                                                            {isSelected && (
                                                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
                                                            )}
                                                        </div>
                                                        <span style={{ fontSize: 14, color: isSelected ? "#F1F5F9" : "#CBD5E1", fontWeight: isSelected ? 500 : 400 }}>
                                                            {opt.text}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    // Collapsed
                                    <div
                                        onClick={() => setExpandedQuestion(q.id)}
                                        style={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            padding: "16px", cursor: "pointer",
                                            opacity: !isAnswered && q.id < expandedQuestion ? 0.6 : 1,
                                        }}
                                    >
                                        <p style={{ fontSize: 14, color: "#94A3B8", margin: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 12 }}>
                                            <span style={{ fontWeight: 700, marginRight: 8 }}>Q{q.id}.</span>
                                            {q.text}
                                        </p>
                                        {isAnswered ? (
                                            <CheckCircle style={{ width: 20, height: 20, color: "#10B981", flexShrink: 0 }} />
                                        ) : (
                                            <Circle style={{ width: 20, height: 20, color: "#475569", flexShrink: 0 }} />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* All answered indicator */}
                {allRiskAnswered && (
                    <div style={{
                        marginTop: 16, padding: "12px 16px",
                        background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                        borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
                    }}>
                        <CheckCircle2 style={{ width: 18, height: 18, color: "#10B981", flexShrink: 0 }} />
                        <p style={{ fontSize: 14, color: "#10B981", fontWeight: 500, margin: 0 }}>
                            All 7 questions answered. You&apos;re ready to continue.
                        </p>
                    </div>
                )}
            </section>

            {/* Bottom Navigation */}
            <StepNavigation
                step={1}
                onNext={handleNext}
                isValid={!!isFormValid}
                isSaving={isSaving}
                validationMessage="Please complete all fields — age, location, employment, and all 7 risk questions"
            />
        </div>
    );
}
