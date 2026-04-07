import { NextRequest, NextResponse } from "next/server";
import { docClient, TABLES } from "@/lib/dynamodb";
import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

// GET — fetch comments for a post
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("post_id");

    if (!postId) {
        return NextResponse.json({ error: "post_id required" }, { status: 400 });
    }

    try {
        const result = await docClient.send(new QueryCommand({
            TableName: TABLES.COMMENTS,
            KeyConditionExpression: "post_id = :pid",
            ExpressionAttributeValues: { ":pid": postId },
        }));

        return NextResponse.json(result.Items || []);
    } catch (error) {
        console.error("Comments GET error:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

// POST — add a comment
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.post_id || !body.author_name || !body.content) {
            return NextResponse.json({ error: "post_id, author_name, and content are required" }, { status: 400 });
        }

        const comment = {
            post_id: body.post_id,
            id: crypto.randomUUID(),
            parent_id: body.parent_id || null,
            author_name: body.author_name.trim(),
            author_email: body.author_email?.trim() || null,
            content: body.content.trim(),
            is_admin: false,
            likes: 0,
            created_at: new Date().toISOString(),
        };

        await docClient.send(new PutCommand({
            TableName: TABLES.COMMENTS,
            Item: comment,
        }));

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("Comments POST error:", error);
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}
