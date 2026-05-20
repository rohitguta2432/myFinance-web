import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { docClient, TABLES } from "@/lib/dynamodb";
import { ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { safeGenerateThumbnail } from "@/lib/thumbnail-gen";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type PostRow = {
    PK: string;
    slug?: string;
    title?: string;
    category?: string;
    cover_image?: string | null;
};

function authorize(request: NextRequest): boolean {
    if (isAuthenticated(request)) return true;
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) return false;
    const url = new URL(request.url);
    return url.searchParams.get("token") === cronSecret;
}

// POST — backfill cover_image for every published post missing one.
// Auth: admin_session cookie OR ?token=<CRON_SECRET>.
// Optional ?force=true regenerates even posts that already have a cover.
// Optional ?limit=N caps how many to process in one call (default 20 to stay under Lambda timeout).
export async function POST(request: NextRequest) {
    if (!authorize(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";
    const limit = Math.max(1, Math.min(50, Number(searchParams.get("limit")) || 20));

    try {
        const scan = await docClient.send(new ScanCommand({ TableName: TABLES.POSTS }));
        const allPosts = (scan.Items || []) as PostRow[];

        const targets = allPosts.filter((p) => {
            if (!p.slug || !p.title) return false;
            if (force) return true;
            return !p.cover_image;
        });

        const batch = targets.slice(0, limit);

        const results: Array<{ slug: string; status: "ok" | "failed"; cover_image?: string; error?: string }> = [];

        for (const post of batch) {
            const url = await safeGenerateThumbnail({
                slug: post.slug!,
                title: post.title!,
                category: post.category || "General",
            });

            if (!url) {
                results.push({ slug: post.slug!, status: "failed", error: "generation/upload returned null" });
                continue;
            }

            try {
                await docClient.send(new UpdateCommand({
                    TableName: TABLES.POSTS,
                    Key: { PK: post.PK },
                    UpdateExpression: "SET cover_image = :c, updated_at = :u",
                    ExpressionAttributeValues: {
                        ":c": url,
                        ":u": new Date().toISOString(),
                    },
                }));
                results.push({ slug: post.slug!, status: "ok", cover_image: url });
            } catch (e) {
                results.push({
                    slug: post.slug!,
                    status: "failed",
                    error: e instanceof Error ? e.message : "DynamoDB update failed",
                });
            }
        }

        return NextResponse.json({
            scanned: allPosts.length,
            eligible: targets.length,
            processed: results.length,
            remaining: Math.max(0, targets.length - results.length),
            results,
        });
    } catch (error) {
        console.error("Backfill thumbnails error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Backfill failed" },
            { status: 500 }
        );
    }
}
