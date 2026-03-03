import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://myfinancial.in";

    const staticRoutes: MetadataRoute.Sitemap = [
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
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
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

    // Dynamically add published blog post slugs
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: posts } = await supabase
            .from("blog_posts")
            .select("slug, updated_at")
            .eq("status", "published")
            .order("published_at", { ascending: false });

        if (posts) {
            const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.updated_at),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            }));
            return [...staticRoutes, ...blogRoutes];
        }
    } catch {
        // If Supabase is unavailable, return static routes only
    }

    return staticRoutes;
}
