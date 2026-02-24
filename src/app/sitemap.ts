import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://myfinancial.in";

    return [
        {
            url: baseUrl,
            lastModified: new Date("2026-02-24"),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/how-it-works`,
            lastModified: new Date("2026-02-24"),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date("2026-02-24"),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date("2026-02-24"),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified: new Date("2026-02-24"),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];
}
