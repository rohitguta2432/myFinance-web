import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog — Financial Insights & Guides",
    description:
        "Expert tips on budgeting, tax saving, insurance, investing and more — tailored for Indian personal finance.",
    alternates: { canonical: "/blog" },
    openGraph: {
        title: "Blog — MyFinancial",
        description:
            "Expert tips on budgeting, tax saving, insurance, investing and more — tailored for India.",
        url: "https://myfinancial.in/blog",
        type: "website",
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
