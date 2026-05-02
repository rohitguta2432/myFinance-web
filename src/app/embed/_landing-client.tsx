"use client";

import { useState } from "react";

const SNIPPET = `<!-- myFinancial SIP Calculator -->
<iframe
  src="https://myfinancial.in/embed/sip-calculator?ref=YOUR_SITE_NAME"
  width="100%"
  height="600"
  frameborder="0"
  loading="lazy"
  title="Free SIP Calculator by myFinancial">
</iframe>
<p style="font-size: 12px; text-align: center; margin-top: 8px;">
  Powered by <a href="https://myfinancial.in/?utm_source=embed&utm_medium=calculator">myFinancial.in</a>
</p>`;

export function EmbedLandingClient() {
    const [copied, setCopied] = useState(false);

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(SNIPPET);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard unavailable — partner can still hand-select */
        }
    };

    return (
        <div className="mx-auto max-w-3xl px-4 py-16" style={{ color: "#F0F4F8" }}>
            <h1 className="text-3xl font-bold mb-3">Free Calculators You Can Embed</h1>
            <p className="mb-8" style={{ color: "#CBD5E1" }}>
                Free for any Indian finance blog or fintech. Mobile-responsive, no ads, do-follow attribution. Drop in 30 seconds.
            </p>

            <div
                className="rounded-xl p-6"
                style={{ background: "#0C1319", border: "1px solid rgba(255,255,255,0.1)" }}
            >
                <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                    <div>
                        <h2 className="text-xl font-semibold">SIP Calculator</h2>
                        <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>
                            Indian rupee formatting · Recharts area chart · 600px iframe
                        </p>
                    </div>
                    <button
                        onClick={onCopy}
                        className="px-4 py-2 rounded-lg font-semibold text-sm transition"
                        style={{ background: "#10B981", color: "#080E12" }}
                    >
                        {copied ? "Copied!" : "Copy snippet"}
                    </button>
                </div>
                <pre
                    className="text-xs rounded-lg p-4 overflow-x-auto"
                    style={{
                        background: "#080E12",
                        border: "1px solid rgba(255,255,255,0.05)",
                        color: "#CBD5E1",
                    }}
                >
                    <code>{SNIPPET}</code>
                </pre>
                <p className="text-xs mt-3" style={{ color: "#94A3B8" }}>
                    Replace <code style={{ color: "#10B981" }}>YOUR_SITE_NAME</code> with your site identifier (e.g.{" "}
                    <code style={{ color: "#10B981" }}>tradebrains</code>) so we can attribute referrals.
                </p>
            </div>

            <p className="text-sm mt-6" style={{ color: "#94A3B8" }}>
                Want a calculator we don&apos;t list yet? Email{" "}
                <a href="mailto:hello@myfinancial.in" style={{ color: "#10B981", textDecoration: "underline" }}>
                    hello@myfinancial.in
                </a>
                .
            </p>
        </div>
    );
}
