"use client";

import { useState, useEffect } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";

interface Section {
  id: string;
  label: string;
}

export function SectionNav({ sections }: { sections: Section[] }) {
  const palette = useAppTheme();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector("header");
    const offset = header ? header.getBoundingClientRect().height + 16 : 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        right: 24,
        top: "45%",
        transform: "translateY(-50%)",
        zIndex: 40,
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 0,
      }}
      className="hidden lg:flex"
    >
      {sections.map(({ id, label }, i) => {
        const isActive = activeId === id;
        const activeIndex = sections.findIndex((s) => s.id === activeId);
        const isPast = activeIndex > i;

        return (
          <div key={id} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <button
              onClick={() => scrollTo(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  color: isActive ? "#10B981" : palette.mute,
                  opacity: 1,
                  transition: "all 0.3s",
                  fontFamily: "var(--font-display)",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  display: "inline-block",
                  borderRadius: "50%",
                  flexShrink: 0,
                  transition: "all 0.3s",
                  width: isActive ? 14 : 10,
                  height: isActive ? 14 : 10,
                  background: isActive ? "#10B981" : isPast ? "rgba(16,185,129,0.4)" : palette.mute,
                  boxShadow: isActive ? "0 0 10px rgba(16,185,129,0.5)" : "none",
                }}
              />
            </button>
            {i < sections.length - 1 && (
              <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", paddingRight: 5 }}>
                <div
                  style={{
                    width: 1,
                    height: 16,
                    background: isPast ? "rgba(16,185,129,0.3)" : palette.brd2,
                    transition: "background 0.3s",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
