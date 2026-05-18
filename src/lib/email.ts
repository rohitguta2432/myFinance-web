import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLES } from "@/lib/dynamodb";
import type { BlogPost } from "@/lib/types";
import crypto from "crypto";

const sesClient = new SESv2Client({
    region: process.env.SES_REGION || process.env.MYAPP_AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY_ID
            || process.env.DYNAMODB_ACCESS_KEY_ID
            || process.env.BEDROCK_ACCESS_KEY_ID
            || "",
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY
            || process.env.DYNAMODB_SECRET_ACCESS_KEY
            || process.env.BEDROCK_SECRET_ACCESS_KEY
            || "",
    },
});

const FROM_EMAIL = process.env.SES_FROM_EMAIL || "newsletter@myfinancial.in";
const FROM_NAME = process.env.SES_FROM_NAME || "MyFinancial";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myfinancial.in";

export function unsubscribeToken(email: string): string {
    const secret = process.env.NEWSLETTER_SECRET || process.env.ADMIN_PASSWORD || "myfinancial";
    return crypto
        .createHmac("sha256", secret)
        .update(email.toLowerCase())
        .digest("hex")
        .slice(0, 32);
}

function renderEmailHtml(post: BlogPost, unsubscribeUrl: string): string {
    const postUrl = `${SITE_URL}/blog/${post.slug}`;
    const coverImg = post.cover_image
        ? `<img src="${post.cover_image}" alt="${escapeHtml(post.title)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border-radius:12px;margin-bottom:24px;" />`
        : "";
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${escapeHtml(post.title)}</title></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0F172A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <tr><td style="padding:32px 32px 0 32px;">
          <div style="font-size:14px;color:#10B981;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:12px;">New on MyFinancial</div>
          ${coverImg}
          <h1 style="font-size:24px;line-height:1.3;margin:0 0 12px 0;color:#0F172A;">${escapeHtml(post.title)}</h1>
          <p style="font-size:15px;line-height:1.6;color:#475569;margin:0 0 24px 0;">${escapeHtml(post.excerpt)}</p>
          <a href="${postUrl}" style="display:inline-block;background:#10B981;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px;">Read the article →</a>
        </td></tr>
        <tr><td style="padding:32px;border-top:1px solid #E2E8F0;margin-top:24px;">
          <p style="font-size:12px;color:#94A3B8;margin:0 0 8px 0;">You're receiving this because you subscribed to MyFinancial.</p>
          <p style="font-size:12px;color:#94A3B8;margin:0;"><a href="${unsubscribeUrl}" style="color:#94A3B8;text-decoration:underline;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function renderEmailText(post: BlogPost, unsubscribeUrl: string): string {
    const postUrl = `${SITE_URL}/blog/${post.slug}`;
    return `New on MyFinancial

${post.title}

${post.excerpt}

Read the article: ${postUrl}

—
Unsubscribe: ${unsubscribeUrl}`;
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export interface Subscriber {
    email: string;
    subscribed_at: string;
    status: "active" | "unsubscribed";
}

export async function listActiveSubscribers(): Promise<Subscriber[]> {
    const result = await docClient.send(new ScanCommand({
        TableName: TABLES.NEWSLETTER_SUBSCRIBERS,
        FilterExpression: "#s = :active",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: { ":active": "active" },
    }));
    return (result.Items || []) as Subscriber[];
}

export async function sendNewPostEmail(post: BlogPost, email: string): Promise<void> {
    const token = unsubscribeToken(email);
    const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
    await sesClient.send(new SendEmailCommand({
        FromEmailAddress: `${FROM_NAME} <${FROM_EMAIL}>`,
        Destination: { ToAddresses: [email] },
        Content: {
            Simple: {
                Subject: { Data: post.title, Charset: "UTF-8" },
                Body: {
                    Html: { Data: renderEmailHtml(post, unsubscribeUrl), Charset: "UTF-8" },
                    Text: { Data: renderEmailText(post, unsubscribeUrl), Charset: "UTF-8" },
                },
            },
        },
    }));
}

export async function broadcastNewPost(post: BlogPost): Promise<{ sent: number; failed: number }> {
    if (post.status !== "published") return { sent: 0, failed: 0 };

    let subscribers: Subscriber[];
    try {
        subscribers = await listActiveSubscribers();
    } catch (err) {
        console.error("[newsletter] failed to list subscribers:", err);
        return { sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const sub of subscribers) {
        try {
            await sendNewPostEmail(post, sub.email);
            sent++;
        } catch (err) {
            failed++;
            console.error(`[newsletter] failed to send to ${sub.email}:`, err);
        }
    }

    console.log(`[newsletter] post=${post.slug} sent=${sent} failed=${failed}`);
    return { sent, failed };
}
