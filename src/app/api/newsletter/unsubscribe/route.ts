import { NextRequest, NextResponse } from "next/server";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLES } from "@/lib/dynamodb";
import { unsubscribeToken } from "@/lib/email";

function htmlResponse(title: string, message: string, status = 200) {
    const body = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title}</title><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0B0F1A;color:#F1F5F9;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.card{background:#0F172A;border:1px solid #1E293B;border-radius:16px;padding:40px;max-width:480px;text-align:center}
h1{margin:0 0 12px;font-size:22px;color:#10B981}p{margin:0 0 20px;color:#CBD5E1;line-height:1.6}
a{color:#10B981;text-decoration:none;font-weight:600}</style></head>
<body><div class="card"><h1>${title}</h1><p>${message}</p><a href="/blog">← Back to MyFinancial</a></div></body></html>`;
    return new NextResponse(body, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const email = (searchParams.get("email") || "").trim().toLowerCase();
    const token = (searchParams.get("token") || "").trim();

    if (!email || !token) {
        return htmlResponse("Invalid link", "This unsubscribe link is missing required information.", 400);
    }
    if (token !== unsubscribeToken(email)) {
        return htmlResponse("Invalid link", "This unsubscribe link is invalid or has expired.", 400);
    }

    try {
        await docClient.send(new UpdateCommand({
            TableName: TABLES.NEWSLETTER_SUBSCRIBERS,
            Key: { email },
            UpdateExpression: "SET #s = :u, unsubscribed_at = :t",
            ExpressionAttributeNames: { "#s": "status" },
            ExpressionAttributeValues: { ":u": "unsubscribed", ":t": new Date().toISOString() },
        }));
        return htmlResponse("You're unsubscribed", `${email} will no longer receive new-post emails from MyFinancial.`);
    } catch (error) {
        console.error("Newsletter unsubscribe error:", error);
        return htmlResponse("Something went wrong", "We couldn't process your request. Please try again.", 500);
    }
}
