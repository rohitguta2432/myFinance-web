import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { docClient, TABLES } from "@/lib/dynamodb";
import { ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

export async function GET(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const result = await docClient.send(new ScanCommand({
            TableName: TABLES.NEWSLETTER_SUBSCRIBERS,
        }));
        const subscribers = (result.Items || []).sort((a, b) =>
            (b.subscribed_at || "").localeCompare(a.subscribed_at || "")
        );
        const active = subscribers.filter((s) => s.status === "active").length;
        return NextResponse.json({ subscribers, total: subscribers.length, active });
    } catch (error) {
        console.error("Admin newsletter GET error:", error);
        return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const email = (searchParams.get("email") || "").trim().toLowerCase();
    if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
    }
    try {
        await docClient.send(new DeleteCommand({
            TableName: TABLES.NEWSLETTER_SUBSCRIBERS,
            Key: { email },
        }));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Admin newsletter DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
    }
}
