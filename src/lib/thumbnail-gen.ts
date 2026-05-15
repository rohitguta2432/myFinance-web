import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const S3_BUCKET = process.env.S3_BLOG_BUCKET || "myfinancial-blog-assets";
const S3_REGION = process.env.S3_BLOG_REGION || "ap-south-1";

const BEDROCK_REGION = process.env.BEDROCK_REGION || process.env.MYAPP_AWS_REGION || "us-east-1";
const PROMPT_MODEL = process.env.THUMBNAIL_PROMPT_MODEL || "us.amazon.nova-pro-v1:0";

const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt/";
const POLLINATIONS_MODEL = process.env.POLLINATIONS_MODEL || "flux";
const NATIVE_W = 1280;
const NATIVE_H = 720;
const OUTPUT_W = 3840;
const OUTPUT_H = 2160;

function getBedrockClient(): BedrockRuntimeClient {
    const accessKeyId = process.env.BEDROCK_ACCESS_KEY_ID || process.env.DYNAMODB_ACCESS_KEY_ID;
    const secretAccessKey = process.env.BEDROCK_SECRET_ACCESS_KEY || process.env.DYNAMODB_SECRET_ACCESS_KEY;
    if (accessKeyId && secretAccessKey) {
        return new BedrockRuntimeClient({
            region: BEDROCK_REGION,
            credentials: { accessKeyId, secretAccessKey },
        });
    }
    return new BedrockRuntimeClient({ region: BEDROCK_REGION });
}

function getS3Client(): S3Client {
    const accessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.BEDROCK_ACCESS_KEY_ID || process.env.DYNAMODB_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.BEDROCK_SECRET_ACCESS_KEY || process.env.DYNAMODB_SECRET_ACCESS_KEY;
    if (accessKeyId && secretAccessKey) {
        return new S3Client({
            region: S3_REGION,
            credentials: { accessKeyId, secretAccessKey },
        });
    }
    return new S3Client({ region: S3_REGION });
}

const FALLBACK_PROMPT = "Abstract geometric shapes, stacked coins, dark navy background, emerald-green accent, minimalist flat editorial illustration, 16:9.";

async function buildPromptViaLLM(title: string, category: string): Promise<string> {
    try {
        const client = getBedrockClient();
        const res = await client.send(new ConverseCommand({
            modelId: PROMPT_MODEL,
            system: [{ text: "You write extremely concise visual image prompts. Reply with only the prompt — no preamble, no quotes." }],
            messages: [{
                role: "user",
                content: [{
                    text: `Write a UNDER 35 WORDS image-generation prompt for a finance blog background image.\n\nTitle: "${title}"\nCategory: ${category}\n\nRequired:\n- Pick 2 concrete abstract visual elements tied to the topic (e.g. stacked coins, arrows, chart bars, building silhouette, rupee glyph, scales, vault, ledger, shield, gears)\n- Style: minimalist flat editorial illustration, dark navy + emerald-green accent, subject on RIGHT side of frame, LEFT half empty for text overlay\n- No text, no faces, 16:9.\n\nReply with only the prompt. Under 35 words.`,
                }],
            }],
            inferenceConfig: { maxTokens: 120, temperature: 0.6 },
        }));
        const text = res.output?.message?.content?.[0]?.text?.trim().replace(/^["']|["']$/g, "");
        if (!text) return FALLBACK_PROMPT;
        return text;
    } catch (err) {
        console.error("LLM prompt build failed, using fallback:", err instanceof Error ? err.message : err);
        return FALLBACK_PROMPT;
    }
}

async function fetchPollinations(prompt: string, seed: number, attempt = 1): Promise<Buffer> {
    const params = new URLSearchParams({
        width: String(NATIVE_W),
        height: String(NATIVE_H),
        model: POLLINATIONS_MODEL,
        nologo: "true",
        enhance: "false",
        seed: String(seed),
    });
    const url = `${POLLINATIONS_BASE}${encodeURIComponent(prompt)}?${params.toString()}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 150_000);
    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.byteLength < 5_000) throw new Error(`Pollinations returned ${buf.byteLength}b (too small)`);
        return buf;
    } catch (err) {
        if (attempt < 3) {
            await new Promise((r) => setTimeout(r, 10_000));
            return fetchPollinations(prompt, seed + attempt, attempt + 1);
        }
        throw err;
    } finally {
        clearTimeout(timer);
    }
}

function escapeXml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function wrapTitle(title: string, max: number, maxLines: number): string[] {
    const words = title.trim().split(/\s+/);
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
        const n = cur ? `${cur} ${w}` : w;
        if (n.length > max && cur) {
            lines.push(cur);
            cur = w;
            if (lines.length === maxLines - 1) {
                const rest = words.slice(words.indexOf(w)).join(" ");
                lines.push(rest.length > max ? rest.slice(0, max - 1).trimEnd() + "…" : rest);
                cur = "";
                break;
            }
        } else {
            cur = n;
        }
    }
    if (cur) lines.push(cur);
    return lines;
}

function buildOverlaySvg(title: string, category: string): Buffer {
    // Overlay is the FULL output size, with dark panel on left ~55% fading to transparent.
    const lines = wrapTitle(title, 22, 4);
    const fontSize = lines.length <= 2 ? 116 : lines.length === 3 ? 100 : 84;
    const lineHeight = Math.round(fontSize * 1.18);
    const blockHeight = lines.length * lineHeight;
    const startY = Math.round(OUTPUT_H / 2 - blockHeight / 2 + fontSize * 0.85);
    const tspans = lines
        .map((line, i) => `<tspan x="200" y="${startY + i * lineHeight}">${escapeXml(line)}</tspan>`)
        .join("");
    const cat = escapeXml(category.toUpperCase());
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${OUTPUT_W} ${OUTPUT_H}" width="${OUTPUT_W}" height="${OUTPUT_H}">
  <defs>
    <linearGradient id="leftPanel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0B0F1A" stop-opacity="0.97"/>
      <stop offset="50%" stop-color="#0B0F1A" stop-opacity="0.92"/>
      <stop offset="75%" stop-color="#0B0F1A" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0B0F1A" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottomShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0B0F1A" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0B0F1A" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <rect width="${OUTPUT_W}" height="${OUTPUT_H}" fill="url(#bottomShade)"/>
  <rect x="0" y="0" width="${Math.round(OUTPUT_W * 0.7)}" height="${OUTPUT_H}" fill="url(#leftPanel)"/>
  <rect x="0" y="0" width="14" height="${OUTPUT_H}" fill="#10B981"/>
  <g font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif">
    <text x="200" y="280" font-size="48" font-weight="600" fill="#10B981" letter-spacing="4">${cat}</text>
    <text font-size="${fontSize}" font-weight="800" fill="#F1F5F9" letter-spacing="-2">${tspans}</text>
    <text x="200" y="${OUTPUT_H - 180}" font-size="56" font-weight="700" fill="#CBD5E1">my<tspan fill="#10B981">financial</tspan></text>
  </g>
</svg>`;
    return Buffer.from(svg, "utf-8");
}

export async function generateThumbnail(opts: {
    slug: string;
    title: string;
    category: string;
}): Promise<string> {
    const { slug, title, category } = opts;

    const prompt = await buildPromptViaLLM(title, category);
    const seed = Math.floor(Math.random() * 1_000_000);
    const nativeBytes = await fetchPollinations(prompt, seed);

    const overlay = buildOverlaySvg(title, category);
    const composed = await sharp(nativeBytes)
        .resize(OUTPUT_W, OUTPUT_H, { kernel: sharp.kernel.lanczos3 })
        .composite([{ input: overlay, top: 0, left: 0 }])
        .jpeg({ quality: 88, mozjpeg: true })
        .toBuffer();

    const key = `thumbnails/${slug}.jpg`;
    const s3 = getS3Client();
    await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: composed,
        ContentType: "image/jpeg",
        CacheControl: "public, max-age=31536000, immutable",
    }));

    return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
}

export function safeGenerateThumbnail(opts: {
    slug: string;
    title: string;
    category: string;
}): Promise<string | null> {
    return generateThumbnail(opts).catch((err) => {
        console.error(`Thumbnail generation failed for slug=${opts.slug}:`, err instanceof Error ? err.message : err);
        return null;
    });
}
