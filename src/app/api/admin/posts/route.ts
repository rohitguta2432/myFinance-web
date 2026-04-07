import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { docClient, TABLES } from "@/lib/dynamodb";
import { GetCommand, PutCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

// GET — List all posts (drafts + published)
export async function GET(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await docClient.send(new ScanCommand({
            TableName: TABLES.POSTS,
        }));

        // Sort by created_at descending
        const posts = (result.Items || []).sort((a, b) =>
            (b.created_at || "").localeCompare(a.created_at || "")
        );

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Admin posts GET error:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}

// POST — Create new post
export async function POST(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Calculate reading time (~200 words per minute)
        const wordCount = (body.content || "").split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));

        const now = new Date().toISOString();
        const id = crypto.randomUUID();

        const postData = {
            PK: `POST#${body.slug}`,
            id,
            title: body.title,
            slug: body.slug,
            excerpt: body.excerpt,
            content: body.content,
            cover_image: body.cover_image || null,
            category: body.category || "General",
            tags: body.tags || [],
            author: body.author || "MyFinancial",
            status: body.status || "draft",
            reading_time: readingTime,
            likes: 0,
            key_takeaways: body.key_takeaways || null,
            published_at: body.status === "published" ? now : null,
            created_at: now,
            updated_at: now,
        };

        await docClient.send(new PutCommand({
            TableName: TABLES.POSTS,
            Item: postData,
        }));

        return NextResponse.json(postData, { status: 201 });
    } catch (error) {
        console.error("Admin posts POST error:", error);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}

// PUT — Update post
export async function PUT(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json({ error: "Post ID required" }, { status: 400 });
        }

        // Calculate reading time
        const wordCount = (body.content || "").split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));

        const now = new Date().toISOString();

        const updateData = {
            PK: `POST#${body.slug}`,
            id: body.id,
            title: body.title,
            slug: body.slug,
            excerpt: body.excerpt,
            content: body.content,
            cover_image: body.cover_image || null,
            category: body.category || "General",
            tags: body.tags || [],
            author: body.author || "MyFinancial",
            status: body.status,
            reading_time: readingTime,
            key_takeaways: body.key_takeaways || null,
            published_at: body.status === "published" && !body.published_at ? now : body.published_at || null,
            created_at: body.created_at || now,
            updated_at: now,
        };

        await docClient.send(new PutCommand({
            TableName: TABLES.POSTS,
            Item: updateData,
        }));

        return NextResponse.json(updateData);
    } catch (error) {
        console.error("Admin posts PUT error:", error);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

// DELETE — Delete post
export async function DELETE(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
        return NextResponse.json({ error: "Post slug required" }, { status: 400 });
    }

    try {
        await docClient.send(new DeleteCommand({
            TableName: TABLES.POSTS,
            Key: { PK: `POST#${slug}` },
        }));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin posts DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
