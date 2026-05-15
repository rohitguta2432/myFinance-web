import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const S3_BUCKET = process.env.S3_BLOG_BUCKET || "myfinancial-blog-assets";
const S3_REGION = process.env.S3_BLOG_REGION || "ap-south-1";

const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt/";
const POLLINATIONS_MODEL = process.env.POLLINATIONS_MODEL || "flux";

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

function buildPrompt(title: string, category: string): string {
    return [
        `Editorial illustration for a personal finance article titled "${title}". Category: ${category}.`,
        "Minimalist modern flat illustration, financial editorial magazine cover style.",
        "Dark navy background (#0B0F1A to #0F172A gradient).",
        "Single subtle emerald green accent (#10B981).",
        "Abstract geometric shapes, simple icons of charts, coins, graphs.",
        "Indian financial context. Composition leaves negative space.",
        "High contrast, professional, magazine cover quality.",
        "NO TEXT, NO WORDS, NO NUMBERS, NO LOGOS, NO PEOPLE FACES.",
    ].join(" ");
}

export async function generateThumbnail(opts: {
    slug: string;
    title: string;
    category: string;
}): Promise<string> {
    const { slug, title, category } = opts;

    const prompt = buildPrompt(title, category);
    const seed = Math.floor(Math.random() * 1_000_000);
    const params = new URLSearchParams({
        width: "1280",
        height: "720",
        model: POLLINATIONS_MODEL,
        nologo: "true",
        enhance: "false",
        seed: String(seed),
    });
    const url = `${POLLINATIONS_BASE}${encodeURIComponent(prompt)}?${params.toString()}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000);
    let imageBytes: Buffer;
    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
            throw new Error(`Pollinations returned HTTP ${res.status}`);
        }
        const buf = await res.arrayBuffer();
        imageBytes = Buffer.from(buf);
        if (imageBytes.byteLength < 5_000) {
            throw new Error(`Pollinations returned suspiciously small image (${imageBytes.byteLength} bytes)`);
        }
    } finally {
        clearTimeout(timer);
    }

    const key = `thumbnails/${slug}.jpg`;
    const s3 = getS3Client();
    await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: imageBytes,
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
