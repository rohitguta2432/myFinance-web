import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

// Paths under /api/v1/ that the backend allows anonymous (GET only).
// Keep in sync with JwtAuthenticationFilter.EXCLUDED_PATHS on the backend.
const PUBLIC_GET_PATHS = new Set<string>([
    "feature-flags",
]);

async function proxyRequest(
    req: NextRequest,
    params: Promise<{ path: string[] }>
): Promise<NextResponse> {
    const { path } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    const targetPath = path.join("/");
    const isPublicGet = req.method === "GET" && PUBLIC_GET_PATHS.has(targetPath);

    if (!token && !isPublicGet) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!BACKEND_URL) {
        console.error("BACKEND_URL is not set");
        return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const search = req.nextUrl.search;
    const targetUrl = `${BACKEND_URL}/api/v1/${targetPath}${search}`;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const body =
        req.method !== "GET" && req.method !== "HEAD"
            ? await req.text()
            : undefined;

    try {
        const res = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
        });

        const text = await res.text();
        return new NextResponse(text || null, {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Proxy request failed:", error);
        return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
    }
}

export const GET = (
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) => proxyRequest(req, params);

export const POST = (
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) => proxyRequest(req, params);

export const PUT = (
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) => proxyRequest(req, params);

export const DELETE = (
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) => proxyRequest(req, params);

export const PATCH = (
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) => proxyRequest(req, params);
