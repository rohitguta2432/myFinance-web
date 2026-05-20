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

const slug = process.argv[2];
if (!slug) {
    console.error("usage: node scripts/publish-blog.mjs <slug>");
    process.exit(1);
}

const mdPath = resolve(process.cwd(), "content", "blog", `${slug}.md`);
const raw = readFileSync(mdPath, "utf8");

const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
if (!fmMatch) throw new Error("no front-matter found");
const [, fmRaw, body] = fmMatch;

const fm = {};
for (const line of fmRaw.split(/\r?\n/)) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (!m) continue;
    let [, k, v] = m;
    v = v.trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    else if (v.startsWith("[") && v.endsWith("]")) {
        v = v.slice(1, -1).split(",").map(s => s.trim().replace(/^"|"$/g, "")).filter(Boolean);
    }
    fm[k] = v;
}

const payload = {
    title: fm.title,
    slug: fm.slug,
    excerpt: fm.description,
    content: body.trim(),
    cover_image: fm.cover_image || null,
    cover_image_alt: fm.cover_image_alt || null,
    category: fm.category,
    tags: Array.isArray(fm.tags) ? fm.tags : [],
    author: fm.author || "MyFinancial",
    status: "published",
    key_takeaways: null,
};

console.log(`[publish] ${payload.title}`);
console.log(`[publish] slug=${payload.slug} category=${payload.category} tags=${payload.tags.length} words=${payload.content.split(/\s+/).length}`);

const loginRes = await fetch(`${SITE}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
});
if (!loginRes.ok) {
    console.error(`[publish] login failed: ${loginRes.status} ${await loginRes.text()}`);
    process.exit(2);
}
const setCookie = loginRes.headers.getSetCookie?.() || loginRes.headers.raw?.()["set-cookie"] || [];
const cookieHeader = setCookie.map(c => c.split(";")[0]).join("; ");
console.log(`[publish] login ok, cookies: ${setCookie.map(c => c.split("=")[0]).join(", ")}`);

const postRes = await fetch(`${SITE}/api/admin/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieHeader },
    body: JSON.stringify(payload),
});
const postText = await postRes.text();
if (!postRes.ok) {
    console.error(`[publish] create failed: ${postRes.status} ${postText}`);
    process.exit(3);
}
const created = JSON.parse(postText);
console.log(`[publish] created id=${created.id} status=${created.status} published_at=${created.published_at}`);
console.log(`[publish] live URL: ${SITE}/blog/${created.slug}`);
