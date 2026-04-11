import { cookies } from "next/headers";

export interface User {
    id: number;
    email: string;
    name: string;
    pictureUrl: string;
}

interface JwtPayload {
    sub: string;
    exp: number;
    [key: string]: unknown;
}

function decodeJwtPayload(token: string): JwtPayload | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = JSON.parse(
            Buffer.from(parts[1], "base64url").toString("utf-8")
        );
        return payload as JwtPayload;
    } catch {
        return null;
    }
}

export async function getSession(): Promise<{ token: string; payload: JwtPayload } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return { token, payload };
}
