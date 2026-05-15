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

const FALLBACK_PROMPT = "Stacked coins, abstract rupee glyph, dark navy background, emerald-green accent, minimalist flat editorial illustration, magazine cover, no text, no faces, generous negative space, 16:9.";

async function buildPromptViaLLM(title: string, category: string): Promise<string> {
    try {
        const client = getBedrockClient();
        const res = await client.send(new ConverseCommand({
            modelId: PROMPT_MODEL,
            system: [{ text: "You write extremely concise visual image prompts. Reply with only the prompt — no preamble, no quotes." }],
            messages: [{
                role: "user",
                content: [{
                    text: `Write a UNDER 40 WORDS image-generation prompt for a finance blog cover.\n\nTitle: "${title}"\nCategory: ${category}\n\nRequired:\n- Pick 2 concrete visual elements tied to the topic (e.g. stacked coins, arrows, chart bars, building silhouette, rupee glyph, scales, vault, ledger, shield)\n- Style: minimalist flat editorial illustration, dark navy + emerald-green accent, magazine cover, no text, no faces, generous negative space, 16:9.\n\nReply with only the prompt. Under 40 words.`,
                }],
            }],
            inferenceConfig: { maxTokens: 150, temperature: 0.6 },
        }));
        const text = res.output?.message?.content?.[0]?.text?.trim().replace(/^["']|["']$/g, "");
        if (!text) return FALLBACK_PROMPT;
        return text;
    } catch (err) {
        console.error("LLM prompt build failed, using fallback:", err instanceof Error ? err.message : err);
        return FALLBACK_PROMPT;
    }
}

async function fetchPollinations(prompt: string, seed: number): Promise<Buffer> {
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
    const timer = setTimeout(() => controller.abort(), 120_000);
    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.byteLength < 5_000) throw new Error(`Pollinations returned ${buf.byteLength}b (too small)`);
        return buf;
    } finally {
        clearTimeout(timer);
    }
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

    const upscaled = await sharp(nativeBytes)
        .resize(OUTPUT_W, OUTPUT_H, { kernel: sharp.kernel.lanczos3 })
        .jpeg({ quality: 88, mozjpeg: true })
        .toBuffer();

    const key = `thumbnails/${slug}.jpg`;
    const s3 = getS3Client();
    await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: upscaled,
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
