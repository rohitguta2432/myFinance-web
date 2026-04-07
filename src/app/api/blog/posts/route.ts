import { NextRequest, NextResponse } from "next/server";
import { docClient, TABLES } from "@/lib/dynamodb";
import { QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const status = searchParams.get("status") || "published";
    const category = searchParams.get("category");
    const exclude = searchParams.get("exclude");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    try {
        // Single post by slug
        if (slug) {
            const result = await docClient.send(new GetCommand({
                TableName: TABLES.POSTS,
                Key: { PK: `POST#${slug}` },
            }));
            if (!result.Item || result.Item.status !== "published") {
                return NextResponse.json({ error: "Not found" }, { status: 404 });
            }
            return NextResponse.json(result.Item);
        }

        // List posts by status using GSI
        const result = await docClient.send(new QueryCommand({
            TableName: TABLES.POSTS,
            IndexName: "status-published_at-index",
            KeyConditionExpression: "#s = :status",
            ExpressionAttributeNames: { "#s": "status" },
            ExpressionAttributeValues: { ":status": status },
            ScanIndexForward: false, // newest first
        }));

        let posts = result.Items || [];

        // Filter by category if specified
        if (category) {
            posts = posts.filter(p => p.category === category);
        }

        // Exclude specific post (for related posts)
        if (exclude) {
            posts = posts.filter(p => p.id !== exclude);
        }

        // Paginate
        const total = posts.length;
        const start = (page - 1) * limit;
        const paginated = posts.slice(start, start + limit);

        return NextResponse.json({ posts: paginated, total });
    } catch (error) {
        console.error("Blog posts API error:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch posts";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
