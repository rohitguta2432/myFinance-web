import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const REGION_DDB = "us-east-1";
const REGION_S3 = "ap-south-1";
const BUCKET = "myfinancial-blog-assets";
const TABLE = "myfinancial-blog-posts";
const NOVA = "us.amazon.nova-pro-v1:0";
const OUTPUT_W = 3840, OUTPUT_H = 2160;

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION_DDB }));
const s3 = new S3Client({ region: REGION_S3 });
const bedrock = new BedrockRuntimeClient({ region: "us-east-1" });

const FALLBACK = "Abstract geometric shapes, stacked coins, dark navy, emerald-green, minimalist flat illustration, subject on RIGHT, 16:9.";

async function buildPrompt(title, category) {
    try {
        const res = await bedrock.send(new ConverseCommand({
            modelId: NOVA,
            system: [{ text: "You write extremely concise visual image prompts. Reply with only the prompt — no preamble, no quotes." }],
            messages: [{ role: "user", content: [{ text: `Write a UNDER 35 WORDS image-generation prompt for a finance blog background image.\n\nTitle: "${title}"\nCategory: ${category}\n\nRequired:\n- Pick 2 concrete abstract visual elements tied to the topic (stacked coins, arrows, chart bars, building silhouette, rupee glyph, scales, vault, ledger, shield, gears)\n- Style: minimalist flat editorial illustration, dark navy + emerald-green accent, subject on RIGHT side of frame, LEFT half empty for text overlay\n- No text, no faces, 16:9.\n\nReply with only the prompt. Under 35 words.` }] }],
            inferenceConfig: { maxTokens: 120, temperature: 0.6 },
        }));
        return res.output?.message?.content?.[0]?.text?.trim().replace(/^["']|["']$/g, "") || FALLBACK;
    } catch { return FALLBACK; }
}

async function fetchImage(prompt, seed, attempt = 1) {
    const params = new URLSearchParams({ width: "1280", height: "720", model: "flux", nologo: "true", enhance: "false", seed: String(seed) });
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 150_000);
    try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.byteLength < 5000) throw new Error(`small (${buf.byteLength}b)`);
        return buf;
    } catch (e) {
        if (attempt < 3) { await new Promise((r) => setTimeout(r, 10_000)); return fetchImage(prompt, seed + attempt, attempt + 1); }
        throw e;
    } finally { clearTimeout(t); }
}

function escapeXml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
function wrap(t,max,maxL){const w=t.trim().split(/\s+/);const L=[];let c='';for(const x of w){const n=c?c+' '+x:x;if(n.length>max&&c){L.push(c);c=x;if(L.length===maxL-1){const r=w.slice(w.indexOf(x)).join(' ');L.push(r.length>max?r.slice(0,max-1).trimEnd()+'…':r);c='';break;}}else c=n;}if(c)L.push(c);return L;}

function buildOverlay(title, category) {
    const lines = wrap(title, 22, 4);
    const fs = lines.length <= 2 ? 116 : lines.length === 3 ? 100 : 84;
    const lh = Math.round(fs * 1.18);
    const bh = lines.length * lh;
    const sy = Math.round(OUTPUT_H / 2 - bh / 2 + fs * 0.85);
    const ts = lines.map((l, i) => `<tspan x="200" y="${sy + i * lh}">${escapeXml(l)}</tspan>`).join("");
    const cat = escapeXml(category.toUpperCase());
    return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${OUTPUT_W} ${OUTPUT_H}" width="${OUTPUT_W}" height="${OUTPUT_H}">
<defs><linearGradient id="lp" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#0B0F1A" stop-opacity="0.97"/><stop offset="50%" stop-color="#0B0F1A" stop-opacity="0.92"/><stop offset="75%" stop-color="#0B0F1A" stop-opacity="0.55"/><stop offset="100%" stop-color="#0B0F1A" stop-opacity="0"/></linearGradient><linearGradient id="bs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0B0F1A" stop-opacity="0"/><stop offset="100%" stop-color="#0B0F1A" stop-opacity="0.6"/></linearGradient></defs>
<rect width="${OUTPUT_W}" height="${OUTPUT_H}" fill="url(#bs)"/>
<rect x="0" y="0" width="${Math.round(OUTPUT_W * 0.7)}" height="${OUTPUT_H}" fill="url(#lp)"/>
<rect x="0" y="0" width="14" height="${OUTPUT_H}" fill="#10B981"/>
<g font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif">
<text x="200" y="280" font-size="48" font-weight="600" fill="#10B981" letter-spacing="4">${cat}</text>
<text font-size="${fs}" font-weight="800" fill="#F1F5F9" letter-spacing="-2">${ts}</text>
<text x="200" y="${OUTPUT_H - 180}" font-size="56" font-weight="700" fill="#CBD5E1">my<tspan fill="#10B981">financial</tspan></text>
</g></svg>`, "utf-8");
}

async function processOne(post) {
    const slug = post.slug;
    const prompt = await buildPrompt(post.title, post.category || "General");
    const native = await fetchImage(prompt, Math.floor(Math.random() * 1_000_000));
    const overlay = buildOverlay(post.title, post.category || "General");
    const composed = await sharp(native)
        .resize(OUTPUT_W, OUTPUT_H, { kernel: sharp.kernel.lanczos3 })
        .composite([{ input: overlay, top: 0, left: 0 }])
        .jpeg({ quality: 88, mozjpeg: true })
        .toBuffer();
    const key = `thumbnails/${slug}.jpg`;
    await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: composed, ContentType: "image/jpeg", CacheControl: "public, max-age=31536000, immutable" }));
    const coverUrl = `https://${BUCKET}.s3.${REGION_S3}.amazonaws.com/${key}`;
    await ddb.send(new UpdateCommand({ TableName: TABLE, Key: { PK: post.PK }, UpdateExpression: "SET cover_image = :c, updated_at = :u", ExpressionAttributeValues: { ":c": coverUrl, ":u": new Date().toISOString() } }));
    try { await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: `thumbnails/${slug}.svg` })); } catch {}
    return { size: composed.byteLength, prompt };
}

async function main() {
    console.log(`Scanning ${TABLE}...`);
    const scan = await ddb.send(new ScanCommand({ TableName: TABLE }));
    const targets = (scan.Items || []).filter((p) => p.slug && p.title);
    console.log(`${targets.length} posts to regenerate (hybrid AI + SVG overlay)\n`);

    let ok = 0, failed = 0;
    const start = Date.now();
    for (let i = 0; i < targets.length; i++) {
        const post = targets[i];
        const t0 = Date.now();
        process.stdout.write(`[${i + 1}/${targets.length}] ${post.slug}... `);
        try {
            const r = await processOne(post);
            console.log(`✓ ${(r.size / 1024).toFixed(0)}KB in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
            ok++;
        } catch (e) {
            console.error(`FAILED: ${e.message}`);
            failed++;
        }
        if (i < targets.length - 1) await new Promise((r) => setTimeout(r, 4000));
    }
    console.log(`\nDone in ${((Date.now() - start) / 60_000).toFixed(1)}min. ok=${ok} failed=${failed}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
