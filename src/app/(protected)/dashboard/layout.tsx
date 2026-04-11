"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3, Zap, Shield, Calculator,
  RefreshCw, Lock, Crown, Check, X,
} from "lucide-react";

const SIDEBAR_TABS = [
  { id: "summary", label: "Summary", icon: BarChart3, path: "/dashboard", premium: false },
  { id: "action-plan", label: "Action Plan", icon: Zap, path: "/dashboard/action-plan", premium: false },
  { id: "insurance", label: "Insurance", icon: Shield, path: "/dashboard/insurance", premium: false },
  { id: "tax", label: "Tax Planning", icon: Calculator, path: "/dashboard/tax", premium: false },
] as const;

const PREMIUM_FEATURES = [
  "Personalized Action Plans — step-by-step guides to fix each red flag",
  "Insurance Gap Analysis — HLV method to calculate exact coverage needed",
  "Tax Regime Comparison — Old vs New with optimization recommendations",
  "Unlimited AI Advisor — ask Kira anything about your finances",
  "Priority Support — get answers within 24 hours",
];

function UpgradeModal({ isOpen, onClose, tabLabel }: { isOpen: boolean; onClose: () => void; tabLabel: string }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 448,
        background: "#0F172A",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24,
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none", background: "radial-gradient(circle at 50% 0%, rgba(245,158,11,0.25), transparent 60%)" }} />
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, zIndex: 20,
          width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "none", cursor: "pointer",
        }}>
          <X size={16} style={{ color: "#94A3B8" }} />
        </button>
        <div style={{ position: "relative", zIndex: 10, padding: "32px 32px 32px", paddingTop: 40, textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(234,88,12,0.2))",
            border: "1px solid rgba(245,158,11,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
          }}>
            <Lock size={28} style={{ color: "#FBBF24" }} />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#F1F5F9", marginBottom: 8, fontFamily: "var(--font-display)" }}>
            {tabLabel} is a Premium Feature
          </h3>
          <p style={{ fontSize: 15, color: "#94A3B8", marginBottom: 24, lineHeight: 1.6, fontFamily: "var(--font-display)" }}>
            Upgrade to unlock detailed analysis and personalized recommendations.
          </p>
          <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {PREMIUM_FEATURES.map((feat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Check size={20} style={{ color: "#34D399", flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.5, fontFamily: "var(--font-display)" }}>{feat}</span>
              </div>
            ))}
          </div>
          <button style={{
            width: "100%",
            padding: "16px 24px",
            background: "linear-gradient(135deg, #F59E0B, #EA580C)",
            color: "#000",
            fontWeight: 700,
            fontSize: 15,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 0 30px rgba(245,158,11,0.3)",
            fontFamily: "var(--font-display)",
          }}>
            Upgrade to Premium
            <span style={{ display: "block", fontSize: 13, fontWeight: 500, opacity: 0.8, marginTop: 2 }}>₹999/year — Cancel anytime</span>
          </button>
          <p style={{ fontSize: 12, color: "#475569", marginTop: 12, fontFamily: "var(--font-display)" }}>No credit card required · 7-day free trial</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTabLabel, setUpgradeTabLabel] = useState("");

  // Premium state from localStorage
  const isPremium = typeof window !== "undefined"
    ? localStorage.getItem("myfinancial_premium") === "true"
    : false;

  const handleTabClick = (tab: (typeof SIDEBAR_TABS)[number]) => {
    if (tab.premium && !isPremium) {
      setUpgradeTabLabel(tab.label);
      setShowUpgradeModal(true);
      return;
    }
    router.push(tab.path);
  };

  return (
    <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 64px)", marginTop: 64 }}>
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} tabLabel={upgradeTabLabel} />

      {/* Left Sidebar — desktop only */}
      <aside style={{
        display: "none",
        flexDirection: "column",
        width: 224,
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(11,15,26,0.5)",
      }} className="lg-sidebar">
        <style>{`@media (min-width: 1024px) { .lg-sidebar { display: flex !important; } }`}</style>
        <nav style={{ flex: 1, padding: 16, paddingTop: 24, display: "flex", flexDirection: "column", gap: 4 }}>
          {isPremium ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", marginBottom: 16 }}>
              <Crown size={20} style={{ color: "#FBBF24" }} />
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, background: "linear-gradient(135deg, #FBBF24, #FB923C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "var(--font-display)" }}>Premium</span>
            </div>
          ) : (
            <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: "#64748B", marginBottom: 16, padding: "0 12px", fontFamily: "var(--font-display)" }}>Dashboard</p>
          )}

          {SIDEBAR_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.path || (tab.path === "/dashboard" && pathname === "/dashboard");
            const isLocked = tab.premium && !isPremium;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 12,
                  textAlign: "left",
                  border: isActive ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent",
                  background: isActive ? "rgba(16,185,129,0.1)" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "var(--font-display)",
                }}
              >
                <Icon size={20} style={{ flexShrink: 0, color: isActive ? "#10B981" : isLocked ? "#475569" : "#64748B" }} />
                <span style={{ fontSize: 14, fontWeight: 600, flex: 1, color: isActive ? "#10B981" : isLocked ? "#475569" : "#94A3B8" }}>{tab.label}</span>
                {isLocked && <Lock size={16} style={{ color: "rgba(245,158,11,0.5)", flexShrink: 0 }} />}
              </button>
            );
          })}

          {/* Retake Assessment */}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <Link href="/assessment/step-1" style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 12,
              textDecoration: "none",
              color: "rgba(251,191,36,0.7)",
              transition: "all 0.15s",
              fontFamily: "var(--font-display)",
            }}>
              <RefreshCw size={20} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Retake Assessment</span>
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer */}
        {!isPremium && (
          <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <button
              onClick={() => { setUpgradeTabLabel("Premium"); setShowUpgradeModal(true); }}
              style={{
                width: "100%",
                padding: 12,
                background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(234,88,12,0.1))",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "center",
                fontFamily: "var(--font-display)",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FBBF24", display: "block" }}>🔓 Upgrade to Premium</span>
              <span style={{ fontSize: 11, color: "#475569", display: "block", marginTop: 2 }}>Unlock all features</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Tab Bar */}
      <style>{`
        @media (max-width: 1023px) {
          .mobile-tab-bar { display: flex !important; }
        }
      `}</style>
      <div
        className="mobile-tab-bar"
        style={{
          display: "none",
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          zIndex: 40,
          background: "rgba(11,15,26,0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: 8,
          gap: 4,
          overflowX: "auto",
        }}
      >
        {SIDEBAR_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.path;
          const isLocked = tab.premium && !isPremium;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                border: "none",
                cursor: "pointer",
                background: isActive ? "rgba(16,185,129,0.15)" : "transparent",
                color: isActive ? "#10B981" : isLocked ? "#475569" : "#64748B",
                fontFamily: "var(--font-display)",
              }}
            >
              <Icon size={14} />
              {tab.label}
              {isLocked && <Lock size={12} style={{ color: "rgba(245,158,11,0.5)", marginLeft: 2 }} />}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
