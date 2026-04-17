import type { Metadata } from "next";
import { DisclaimerContent } from "./disclaimer-content";

export const metadata: Metadata = {
    title: "Disclaimer",
    description:
        "MyFinancial Disclaimer — this tool is for informational purposes only and does not constitute financial advice. Consult a SEBI-registered advisor.",
};

export default function DisclaimerPage() {
    return <DisclaimerContent />;
}
