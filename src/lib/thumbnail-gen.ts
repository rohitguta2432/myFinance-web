import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const S3_BUCKET = process.env.S3_BLOG_BUCKET || "myfinancial-blog-assets";
const S3_REGION = process.env.S3_BLOG_REGION || "ap-south-1";

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

function escapeXml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

// Greedy word-wrap targeting ~N characters per line at the chosen font size.
function wrapTitle(title: string, maxCharsPerLine: number, maxLines: number): string[] {
    const words = title.trim().split(/\s+/);
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
        const next = current ? `${current} ${word}` : word;
        if (next.length > maxCharsPerLine && current) {
            lines.push(current);
            current = word;
            if (lines.length === maxLines - 1) {
                // Last allowed line — pack the rest, truncate with ellipsis if too long.
                const rest = words.slice(words.indexOf(word)).join(" ");
                lines.push(rest.length > maxCharsPerLine ? rest.slice(0, maxCharsPerLine - 1).trimEnd() + "…" : rest);
                current = "";
                break;
            }
        } else {
            current = next;
        }
    }
    if (current) lines.push(current);
    return lines;
}

function buildSvg(title: string, category: string): string {
    const lines = wrapTitle(title, 28, 4);
    const fontSize = lines.length <= 2 ? 84 : lines.length === 3 ? 76 : 64;
    const lineHeight = Math.round(fontSize * 1.18);
    const blockHeight = lines.length * lineHeight;
    const startY = Math.round(360 - blockHeight / 2 + fontSize * 0.85);
    const tspans = lines
        .map((line, i) => `<tspan x="80" y="${startY + i * lineHeight}">${escapeXml(line)}</tspan>`)
        .join("");

    const cat = escapeXml(category.toUpperCase());

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#0B0F1A"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <rect x="0" y="0" width="6" height="720" fill="#10B981"/>
  <g font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif">
    <text x="80" y="110" font-size="22" font-weight="600" fill="#10B981" letter-spacing="2">${cat}</text>
    <text font-size="${fontSize}" font-weight="700" fill="#F1F5F9" letter-spacing="-1">${tspans}</text>
    <text x="80" y="660" font-size="26" font-weight="600" fill="#CBD5E1">my<tspan fill="#10B981">financial</tspan></text>
  </g>
</svg>`;
}

export async function generateThumbnail(opts: {
    slug: string;
    title: string;
    category: string;
}): Promise<string> {
    const { slug, title, category } = opts;
    const svg = buildSvg(title, category);

    const key = `thumbnails/${slug}.svg`;
    const s3 = getS3Client();
    await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: Buffer.from(svg, "utf-8"),
        ContentType: "image/svg+xml",
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
