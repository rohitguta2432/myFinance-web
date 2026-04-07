import type { MetadataRoute } from "next";
import { docClient, TABLES } from "@/lib/dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

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
        const result = await docClient.send(new QueryCommand({
            TableName: TABLES.POSTS,
            IndexName: "status-published_at-index",
            KeyConditionExpression: "#s = :published",
            ExpressionAttributeNames: { "#s": "status" },
            ExpressionAttributeValues: { ":published": "published" },
        }));

        if (result.Items) {
            const blogRoutes: MetadataRoute.Sitemap = result.Items.map((post) => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: new Date(post.updated_at || post.published_at),
                changeFrequency: "weekly" as const,
                priority: 0.7,
            }));
            return [...staticRoutes, ...blogRoutes];
        }
    } catch {
        // If DynamoDB is unavailable, return static routes only
    }

    return staticRoutes;
}
