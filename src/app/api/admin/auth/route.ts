import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    const { username, password } = await request.json();

    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminPass) {
        return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
    }

    if (username !== adminUser || password !== adminPass) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate a simple session token
    const token = crypto.randomBytes(32).toString("hex");

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
    });

    // Also store the token server-side (simplified: env-based validation)
    // In production, use a proper session store
    response.cookies.set("admin_session", crypto.createHash("sha256").update(adminPass).digest("hex"), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
    });

    return response;
}
