import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    const cookieStore = await cookies();
    const profileCookie = cookieStore.get("user_profile")?.value;

    if (!profileCookie) {
        return NextResponse.json({
            user: {
                id: session.payload.sub,
                email: session.payload.email ?? "",
                name: "",
                pictureUrl: "",
            },
        });
    }

    try {
        const user = JSON.parse(profileCookie);
        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
