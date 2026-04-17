import type { Metadata } from "next";
import { PrivacyContent } from "./privacy-content";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description:
        "MyFinancial Privacy Policy — all data stored locally in your browser. No servers, no accounts, no tracking. Export or delete your data anytime.",
};

export default function PrivacyPage() {
    return <PrivacyContent />;
}
