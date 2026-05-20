import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { backfillWelcomeEmails } from "@/lib/email";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const result = await backfillWelcomeEmails();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Newsletter backfill error:", error);
        return NextResponse.json({ error: "Backfill failed" }, { status: 500 });
    }
}
