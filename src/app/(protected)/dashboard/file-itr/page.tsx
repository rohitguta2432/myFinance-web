"use client";

import { useState } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";

const AIKAARA_URL = "https://aikaara-stg-backend.flyyx.in/myfinancials/";

export default function FileItrPage() {
  const palette = useAppTheme();
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: palette.txt, margin: 0, fontFamily: "var(--font-display)" }}>File ITR</h2>
        <p style={{ fontSize: 13, color: palette.mute, margin: "4px 0 0", fontFamily: "var(--font-display)" }}>
          File your Income Tax Return.
        </p>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "calc(100vh - 200px)",
          minHeight: 600,
          background: palette.s1,
          border: `1px solid ${palette.brd}`,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: palette.s1,
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                borderStyle: "solid",
                borderWidth: 3,
                borderTopColor: "#10B981",
                borderRightColor: "rgba(16,185,129,0.3)",
                borderBottomColor: "rgba(16,185,129,0.3)",
                borderLeftColor: "rgba(16,185,129,0.3)",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: 13, color: palette.mute, margin: 0, fontFamily: "var(--font-display)" }}>Loading ITR filing portal…</p>
          </div>
        )}
        <iframe
          src={AIKAARA_URL}
          title="File ITR — Aikaara"
          onLoad={() => setLoading(false)}
          allow="clipboard-read; clipboard-write"
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
      </div>
    </div>
  );
}
