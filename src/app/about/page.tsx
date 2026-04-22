import type { Metadata } from "next";
import { AboutContent } from "./about-content";

const SITE_URL = "https://myfinancial.in";

export const metadata: Metadata = {
    title: "About — Nithin Pushkaran & MyFinancial",
    description:
        "Nithin Pushkaran, NISM-certified founder of MyFinancial, built the platform to give Indian professionals a structured, transparent, conflict-free view of their financial health.",
    alternates: { canonical: "/about" },
    openGraph: {
        title: "About MyFinancial — Nithin Pushkaran, Founder",
        description:
            "NISM-certified founder. Privacy-first personal finance for Indian professionals.",
        url: `${SITE_URL}/about`,
        type: "profile",
    },
};

const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nithin Pushkaran",
    url: `${SITE_URL}/about`,
    image: `${SITE_URL}/nitin.jpeg`,
    jobTitle: "Founder",
    worksFor: {
        "@type": "Organization",
        name: "MyFinancial",
        url: SITE_URL,
    },
    description:
        "NISM-certified founder of MyFinancial. Builds tools to give Indian earning professionals a clear, honest, conflict-free view of their financial health.",
    hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        name: "NISM Certified",
        recognizedBy: {
            "@type": "Organization",
            name: "National Institute of Securities Markets",
        },
    },
    nationality: { "@type": "Country", name: "India" },
};

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MyFinancial",
    legalName: "MyFinancial",
    url: SITE_URL,
    logo: `${SITE_URL}/myfinancial-logo.svg`,
    description:
        "Free, privacy-first personal finance tool for Indians. Post-tax reality check, tax regime optimizer, insurance gap analysis.",
    founder: {
        "@type": "Person",
        name: "Nithin Pushkaran",
        url: `${SITE_URL}/about`,
    },
    foundingLocation: { "@type": "Place", name: "India" },
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: [
        "Personal finance",
        "Income tax India",
        "Insurance planning",
        "Investment basics",
        "Retirement planning",
        "Financial planning for Indian professionals",
    ],
};

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
    ],
};

export default function AboutPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <AboutContent />
        </>
    );
}
