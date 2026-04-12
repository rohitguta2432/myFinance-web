"use client";

import React from "react";
import { useAppTheme } from "@/hooks/useAppTheme";

export interface SliderInputProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    formatDisplay?: (value: number) => string;
    unit?: string;
}

export function SliderInput({ label, value, min, max, step, onChange, formatDisplay, unit }: SliderInputProps) {
    const palette = useAppTheme();
    const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

    const clamp = (v: number) => Math.min(max, Math.max(min, v));

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseFloat(e.target.value));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = parseFloat(e.target.value);
        if (!isNaN(parsed)) {
            onChange(parsed);
        }
    };

    const handleNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const parsed = parseFloat(e.target.value);
        if (!isNaN(parsed)) {
            onChange(clamp(parsed));
        }
    };

    const displayValue = formatDisplay ? formatDisplay(value) : String(value) + (unit ? ` ${unit}` : "");

    return (
        <div style={{ marginBottom: 24 }}>
            <style>{`
                input[type='range'].calc-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    height: 4px;
                    border-radius: 2px;
                    outline: none;
                    cursor: pointer;
                    background: linear-gradient(
                        to right,
                        #10B981 0%,
                        #10B981 ${pct}%,
                        var(--calc-slider-track, rgba(255,255,255,0.1)) ${pct}%,
                        var(--calc-slider-track, rgba(255,255,255,0.1)) 100%
                    );
                }
                input[type='range'].calc-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #10B981;
                    cursor: pointer;
                    box-shadow: 0 0 0 3px rgba(16,185,129,0.2);
                }
                input[type='range'].calc-slider::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #10B981;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 0 0 3px rgba(16,185,129,0.2);
                }
            `}</style>

            {/* Label row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: palette.txt2, fontFamily: "var(--font-display)", fontWeight: 600 }}>
                    {label}
                </span>
                <span
                    style={{
                        fontSize: 15,
                        color: palette.accent,
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                    }}
                >
                    {displayValue}
                </span>
            </div>

            {/* Range slider */}
            <input
                type="range"
                className="calc-slider"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleRangeChange}
                style={{
                    // dynamic gradient applied via style tag above using pct
                    background: `linear-gradient(to right, #10B981 0%, #10B981 ${pct}%, ${palette.brd2} ${pct}%, ${palette.brd2} 100%)`,
                }}
            />

            {/* Number input */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <input
                    type="number"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={handleNumberChange}
                    onBlur={handleNumberBlur}
                    style={{
                        width: 100,
                        background: "transparent",
                        border: `1px solid ${palette.brd2}`,
                        color: palette.txt,
                        fontFamily: "var(--font-display)",
                        fontSize: 14,
                        fontWeight: 600,
                        borderRadius: 8,
                        padding: "6px 10px",
                        textAlign: "right",
                        outline: "none",
                    }}
                />
                {unit && (
                    <span style={{ alignSelf: "center", marginLeft: 6, color: palette.mute, fontSize: 13 }}>
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}
