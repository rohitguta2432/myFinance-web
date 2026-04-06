import type { Metadata } from "next";
import { Bricolage_Grotesque, Newsreader } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileStickyCTA } from "@/components/layout/mobile-sticky-cta";

const bricolage = Bricolage_Grotesque({
    subsets: ["latin"],
    variable: "--font-display",
    weight: ["400", "600", "700", "800"],
});

const newsreader = Newsreader({
    subsets: ["latin"],
    variable: "--font-serif",
    weight: ["400", "600", "700"],
    style: ["normal", "italic"],
});

export const metadata: Metadata = {
    title: {
        default: "MyFinancial — Know Your Money. Own Your Future.",
        template: "%s | MyFinancial",
    },
    description:
        "Free, privacy-first personal finance tool for Indians. Post-tax reality check, tax regime optimizer, insurance gap analysis — all without sharing your name, phone, or email.",
    keywords: [
        "personal finance India",
        "tax optimizer FY 2026-27",
        "financial planning tool",
        "privacy first finance",
        "insurance gap analysis",
        "post tax calculator",
        "net worth India",
    ],
    authors: [{ name: "MyFinancial" }],
    metadataBase: new URL("https://myfinancial.in"),
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: "https://myfinancial.in",
        siteName: "MyFinancial",
        title: "MyFinancial — Know Your Money. Own Your Future.",
        description:
            "Free, privacy-first personal finance tool for Indians. Post-tax reality, tax regime optimizer, insurance gap check — zero data shared.",
    },
    twitter: {
        card: "summary_large_image",
        title: "MyFinancial — Know Your Money. Own Your Future.",
        description:
            "Free, privacy-first personal finance tool for Indians. No signup, no data sharing.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${bricolage.variable} ${newsreader.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: "MyFinancial",
                            url: "https://myfinancial.in",
                            description:
                                "Free, privacy-first personal finance tool for Indians",
                            potentialAction: {
                                "@type": "SearchAction",
                                target: "https://myfinancial.in/blog?q={search_term_string}",
                                "query-input":
                                    "required name=search_term_string",
                            },
                        }),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            name: "MyFinancial",
                            url: "https://myfinancial.in",
                            applicationCategory: "FinanceApplication",
                            operatingSystem: "Web",
                            offers: {
                                "@type": "Offer",
                                price: "0",
                                priceCurrency: "INR",
                            },
                            description:
                                "Free, privacy-first personal finance tool for Indians. Tax optimizer, insurance gap analysis, net worth calculator.",
                        }),
                    }}
                />
            </head>
            <body>
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-teal focus:text-bg focus:rounded-lg"
                >
                    Skip to main content
                </a>
                <Navbar />
                <main id="main-content">{children}</main>
                <Footer />
                <MobileStickyCTA />
            </body>
        </html>
    );
}
