import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
        return NextResponse.json({ error: "Backend not configured" }, { status: 500 });
    }

    let credential: string;

    if (body.credential) {
        credential = body.credential;
    } else if (body.code) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: "OAuth not configured" }, { status: 500 });
        }

        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code: body.code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: "postmessage",
                grant_type: "authorization_code",
            }),
        });

        if (!tokenRes.ok) {
            const text = await tokenRes.text();
            return NextResponse.json(
                { error: "Token exchange failed", detail: text },
                { status: 401 }
            );
        }

        const tokens = await tokenRes.json();
        credential = tokens.id_token;
    } else {
        return NextResponse.json({ error: "Missing credential or code" }, { status: 400 });
    }

    const res = await fetch(`${backendUrl}/api/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
    });

    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json(
            { error: "Authentication failed", detail: text },
            { status: 401 }
        );
    }

    const data = await res.json();

    const cookieStore = await cookies();
    cookieStore.set("session", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("user_profile", JSON.stringify(data.user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ user: data.user });
}
