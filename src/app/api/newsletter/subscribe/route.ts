import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLES } from "@/lib/dynamodb";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const rawEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

        if (!rawEmail || !EMAIL_RE.test(rawEmail) || rawEmail.length > 254) {
            return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
        }

        const now = new Date().toISOString();
        await docClient.send(new PutCommand({
            TableName: TABLES.NEWSLETTER_SUBSCRIBERS,
            Item: {
                email: rawEmail,
                status: "active",
                subscribed_at: now,
                source: typeof body?.source === "string" ? body.source.slice(0, 64) : "blog",
            },
        }));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Newsletter subscribe error:", error);
        return NextResponse.json({ error: "Failed to subscribe. Try again later." }, { status: 500 });
    }
}
