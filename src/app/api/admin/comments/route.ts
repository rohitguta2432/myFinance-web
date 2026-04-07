import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { docClient, TABLES } from "@/lib/dynamodb";
import { ScanCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

// GET — List all comments (for moderation)
export async function GET(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await docClient.send(new ScanCommand({
            TableName: TABLES.COMMENTS,
        }));

        // Sort by created_at descending
        const comments = (result.Items || []).sort((a, b) =>
            (b.created_at || "").localeCompare(a.created_at || "")
        );

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Admin comments GET error:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

// POST — Admin reply to a comment
export async function POST(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        const comment = {
            post_id: body.post_id,
            id: crypto.randomUUID(),
            parent_id: body.parent_id || null,
            author_name: body.author_name || "MyFinancial",
            content: body.content,
            is_admin: true,
            likes: 0,
            created_at: new Date().toISOString(),
        };

        await docClient.send(new PutCommand({
            TableName: TABLES.COMMENTS,
            Item: comment,
        }));

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("Admin comments POST error:", error);
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}

// DELETE — Delete a comment
export async function DELETE(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("post_id");
    const id = searchParams.get("id");

    if (!postId || !id) {
        return NextResponse.json({ error: "post_id and id are required" }, { status: 400 });
    }

    try {
        await docClient.send(new DeleteCommand({
            TableName: TABLES.COMMENTS,
            Key: { post_id: postId, id },
        }));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin comments DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }
}
