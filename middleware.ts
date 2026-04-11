import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const session = req.cookies.get("session")?.value;

    if (!session) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/assessment/:path*"],
};
