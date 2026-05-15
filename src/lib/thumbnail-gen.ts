import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const CANVAS_MODEL = "amazon.nova-canvas-v1:0";

const CANVAS_REGION = process.env.BEDROCK_CANVAS_REGION || "us-east-1";
const S3_BUCKET = process.env.S3_BLOG_BUCKET || "myfinancial-blog-assets";
const S3_REGION = process.env.S3_BLOG_REGION || "ap-south-1";

function getCanvasClient(): BedrockRuntimeClient {
    const accessKeyId = process.env.BEDROCK_ACCESS_KEY_ID || process.env.DYNAMODB_ACCESS_KEY_ID;
    const secretAccessKey = process.env.BEDROCK_SECRET_ACCESS_KEY || process.env.DYNAMODB_SECRET_ACCESS_KEY;
    if (accessKeyId && secretAccessKey) {
        return new BedrockRuntimeClient({
            region: CANVAS_REGION,
            credentials: { accessKeyId, secretAccessKey },
        });
    }
    return new BedrockRuntimeClient({ region: CANVAS_REGION });
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

function buildPrompt(title: string, category: string): string {
    return [
        `Editorial illustration for a personal finance article titled "${title}". Category: ${category}.`,
        "Minimalist modern flat illustration, financial editorial style.",
        "Dark navy background (#0B0F1A to #0F172A gradient).",
        "Single subtle emerald green accent (#10B981).",
        "Abstract geometric shapes, simple icons of charts/coins/graphs/buildings as appropriate.",
        "Indian financial context (rupee symbol allowed as a graphic shape).",
        "Composition leaves negative space.",
        "Magazine cover quality, high contrast, professional.",
        "Strictly NO TEXT, NO WORDS, NO NUMBERS, NO LOGOS, NO PEOPLE FACES.",
        "16:9 horizontal aspect ratio.",
    ].join(" ");
}

const NEGATIVE_PROMPT = "text, words, letters, numbers, captions, watermarks, logos, signatures, low quality, blurry, distorted, ugly, deformed, generic stock photo, photo of person, face, hands, photograph";

export async function generateThumbnail(opts: {
    slug: string;
    title: string;
    category: string;
}): Promise<string> {
    const { slug, title, category } = opts;

    const client = getCanvasClient();
    const body = {
        taskType: "TEXT_IMAGE",
        textToImageParams: {
            text: buildPrompt(title, category),
            negativeText: NEGATIVE_PROMPT,
        },
        imageGenerationConfig: {
            numberOfImages: 1,
            width: 1280,
            height: 720,
            cfgScale: 7.5,
            quality: "standard",
            seed: Math.floor(Math.random() * 858993459),
        },
    };

    const cmd = new InvokeModelCommand({
        modelId: CANVAS_MODEL,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(body),
    });

    const res = await client.send(cmd);
    const responseBody = JSON.parse(new TextDecoder().decode(res.body));
    const base64Image: string | undefined = responseBody?.images?.[0];
    if (!base64Image) {
        throw new Error(`Nova Canvas returned no image (response: ${JSON.stringify(responseBody).slice(0, 300)})`);
    }

    const imageBytes = Buffer.from(base64Image, "base64");

    const key = `thumbnails/${slug}.png`;
    const s3 = getS3Client();
    await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: imageBytes,
        ContentType: "image/png",
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
