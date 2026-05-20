import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE = process.env.PUBLISH_SITE || "https://myfinancial.in";

function readEnvLocal() {
    try {
        const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
        const env = {};
        for (const line of raw.split(/\r?\n/)) {
            const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
            if (m) env[m[1]] = m[2];
        }
        return env;
    } catch {
        return {};
    }
}

const env = readEnvLocal();
const USERNAME = process.env.ADMIN_USERNAME || env.ADMIN_USERNAME || "admin";
const PASSWORD = process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD;
if (!PASSWORD) {
    console.error("ADMIN_PASSWORD not set (env or .env.local)");
    process.exit(1);
}

console.log(`[backfill] target: ${SITE}`);

const loginRes = await fetch(`${SITE}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
});
if (!loginRes.ok) {
    console.error(`[backfill] login failed: ${loginRes.status} ${await loginRes.text()}`);
    process.exit(2);
}
const setCookie = loginRes.headers.getSetCookie?.() || [];
const cookieHeader = setCookie.map(c => c.split(";")[0]).join("; ");

const res = await fetch(`${SITE}/api/admin/newsletter/backfill`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieHeader },
});
const text = await res.text();
console.log(`[backfill] HTTP ${res.status}`);
console.log(text);
process.exit(res.ok ? 0 : 3);
