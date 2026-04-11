import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;

    // Forward session JWT cookie to the Spring Boot backend
    const sessionCookie = request.cookies.get('session')?.value;

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || 'https://api-preprod.myfinancial.in';

    const res = await fetch(`${backendUrl}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionCookie ? { Authorization: `Bearer ${sessionCookie}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // Return 200 so the widget handles the error message gracefully in-UI
      return NextResponse.json(
        {
          reply:
            "I'm having trouble connecting right now. Please try again in a moment.",
        },
        { status: 200 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        reply:
          "I couldn't process your request right now. Please try again in a moment.",
      },
      { status: 200 }
    );
  }
}
