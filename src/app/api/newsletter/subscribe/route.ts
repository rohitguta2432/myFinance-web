import { NextRequest, NextResponse } from "next/server";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLES } from "@/lib/dynamodb";
import { sendWelcomeWithLatestPost } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const rawEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

        if (!rawEmail || !EMAIL_RE.test(rawEmail) || rawEmail.length > 254) {
            return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
        }

        const existing = await docClient.send(new GetCommand({
            TableName: TABLES.NEWSLETTER_SUBSCRIBERS,
            Key: { email: rawEmail },
        }));
        const isFirstTimeActive = !existing.Item || existing.Item.status !== "active";

        const now = new Date().toISOString();
        await docClient.send(new PutCommand({
            TableName: TABLES.NEWSLETTER_SUBSCRIBERS,
            Item: {
                email: rawEmail,
                status: "active",
                subscribed_at: existing.Item?.subscribed_at || now,
                source: typeof body?.source === "string" ? body.source.slice(0, 64) : "blog",
                last_active_at: now,
            },
        }));

        if (isFirstTimeActive) {
            void sendWelcomeWithLatestPost(rawEmail).catch((e) =>
                console.error(`[newsletter] welcome send failed for ${rawEmail}:`, e)
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Newsletter subscribe error:", error);
        return NextResponse.json({ error: "Failed to subscribe. Try again later." }, { status: 500 });
    }
}
