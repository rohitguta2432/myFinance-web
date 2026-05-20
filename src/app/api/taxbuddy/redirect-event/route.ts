/**
 * Anonymous TaxBuddy interstitial event log.
 *
 * This endpoint exists purely to prove the disclosure was shown — it does
 * **not** capture user identity, IP, PAN, email, or any other PII. The only
 * client-supplied identifier is a localStorage-scoped random UUID
 * (`anonSessionToken`) which is never linked back to a user account on the
 * server.
 *
 * The IP and User-Agent are not stored. If you ever need to add them, you
 * must first update the published Privacy Policy — see
 * docs/compliance/taxbuddy-redirect/03-privacy-policy-and-consent.md.
 */

import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLES } from "@/lib/dynamodb";

type EventType =
    | "interstitial_shown"
    | "redirect_proceeded"
    | "redirect_cancelled";

const VALID_EVENTS: ReadonlySet<EventType> = new Set([
    "interstitial_shown",
    "redirect_proceeded",
    "redirect_cancelled",
]);

interface IncomingBody {
    anonSessionToken?: string;
    eventType?: string;
    sourceCTA?: string;
    noticeVersion?: string;
    userLocale?: string;
    clientOccurredAt?: string;
}

function sanitiseString(value: unknown, max = 128): string {
    if (typeof value !== "string") return "";
    return value.slice(0, max);
}

export async function POST(request: NextRequest) {
    let body: IncomingBody;
    try {
        body = (await request.json()) as IncomingBody;
    } catch {
        return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const eventType = sanitiseString(body.eventType, 32);
    if (!VALID_EVENTS.has(eventType as EventType)) {
        return NextResponse.json({ error: "invalid_event_type" }, { status: 400 });
    }

    const anonSessionToken = sanitiseString(body.anonSessionToken, 64);
    const sourceCTA = sanitiseString(body.sourceCTA, 64) || "unknown";
    const noticeVersion = sanitiseString(body.noticeVersion, 32) || "unversioned";
    const userLocale = sanitiseString(body.userLocale, 16) || "unknown";

    const now = new Date();
    const recordedAt = now.toISOString();
    let clientOccurredAt = sanitiseString(body.clientOccurredAt, 40);
    if (!clientOccurredAt || Number.isNaN(Date.parse(clientOccurredAt))) {
        clientOccurredAt = recordedAt;
    }

    const eventId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `evt_${now.getTime()}_${Math.random().toString(36).slice(2, 10)}`;

    try {
        await docClient.send(
            new PutCommand({
                TableName: TABLES.TAXBUDDY_EVENTS,
                Item: {
                    PK: `EVENT#${eventId}`,
                    SK: recordedAt,
                    eventId,
                    eventType,
                    anonSessionToken: anonSessionToken || "anonymous",
                    sourceCTA,
                    noticeVersion,
                    userLocale,
                    clientOccurredAt,
                    recordedAt,
                    // Deliberately omitted: IP, User-Agent, user identity,
                    // any field that would tie this event to a real person.
                },
            })
        );
    } catch (err) {
        // Never bubble up the underlying error to the client — the client only
        // needs to know whether the redirect should proceed (it always should).
        console.error("taxbuddy redirect-event write failed", err);
        return NextResponse.json(
            { ok: false, recorded: false },
            { status: 202 }
        );
    }

    return NextResponse.json({ ok: true, eventId, recordedAt }, { status: 201 });
}
