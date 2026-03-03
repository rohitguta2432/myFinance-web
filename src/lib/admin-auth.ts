import { NextRequest } from "next/server";
import crypto from "crypto";

/**
 * Check if the incoming request has a valid admin session cookie.
 */
export function isAuthenticated(request: NextRequest): boolean {
    const session = request.cookies.get("admin_session")?.value;
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!session || !adminPass) return false;
    return session === crypto.createHash("sha256").update(adminPass).digest("hex");
}
