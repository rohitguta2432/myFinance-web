import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { docClient, TABLES } from "@/lib/dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL_ID = "us.amazon.nova-pro-v1:0";
const AUTHOR = "Nithin Pushkaran";

type Topic = { topic: string; category: string; slugHint: string };

// Rotation pool — add more over time.
const TOPICS: Topic[] = [
    { topic: "Budget 2026 perquisite changes for salaried professionals earning ₹15L+", category: "Tax Planning", slugHint: "budget-2026-perquisite-changes-salaried" },
    { topic: "Old Tax Regime vs New Tax Regime FY 2025-26 with real salary examples for ₹15L, ₹25L, ₹50L earners", category: "Tax Planning", slugHint: "old-vs-new-regime-fy-2025-26-real-salary-examples" },
    { topic: "CTC restructuring playbook to save ₹3-5 lakh tax under Budget 2026", category: "Tax Planning", slugHint: "ctc-restructuring-playbook-2026" },
    { topic: "NPS Tier-I vs Corporate NPS which saves more tax for ₹25L salary", category: "Retirement Planning", slugHint: "nps-tier-1-vs-corporate-nps-25l-salary" },
    { topic: "Section 80CCD(1B) ₹50,000 NPS deduction complete guide for FY 2025-26", category: "Tax Planning", slugHint: "section-80ccd-1b-nps-deduction-guide" },
    { topic: "Term insurance vs endowment plans why ₹3L/year LIC is costing ₹15L over 20 years", category: "Insurance Planning", slugHint: "term-vs-endowment-hidden-cost-20-years" },
    { topic: "How much term insurance cover do ₹15L+ earners actually need formula and examples", category: "Insurance Planning", slugHint: "term-insurance-cover-calculation-15l-earners" },
    { topic: "How much retirement corpus do you need at 40 to retire at ₹2L/month income", category: "Retirement Planning", slugHint: "retirement-corpus-40-years-2l-monthly" },
    { topic: "Meal coupons child education hostel allowance the ₹3.9L salary hack post Budget 2026", category: "Tax Planning", slugHint: "meal-coupons-education-hostel-allowance-2026" },
    { topic: "HRA optimisation guide for metro renters claiming maximum tax benefit FY 2025-26", category: "Tax Planning", slugHint: "hra-optimisation-metro-2026" },
    { topic: "LTA Leave Travel Allowance claim guide 4-year block rules and documentation", category: "Tax Planning", slugHint: "lta-claim-guide-4-year-block" },
    { topic: "Section 80D health insurance premium deductions for self parents senior citizens 2026", category: "Tax Planning", slugHint: "section-80d-health-insurance-2026" },
    { topic: "Home loan tax benefits Section 24 and 80C under new vs old regime FY 2025-26", category: "Tax Planning", slugHint: "home-loan-tax-benefits-2026" },
    { topic: "Capital gains tax on equity mutual funds FY 2025-26 short term vs long term", category: "Tax Planning", slugHint: "capital-gains-equity-mutual-funds-2026" },
    { topic: "ELSS vs PPF vs NPS which 80C option gives best post-tax returns", category: "Tax Planning", slugHint: "elss-vs-ppf-vs-nps-80c-returns" },
    { topic: "How to structure ₹22 lakh CTC for maximum take-home post Budget 2026", category: "Tax Planning", slugHint: "22-lakh-ctc-structure-2026" },
    { topic: "How to structure ₹35 lakh CTC for maximum take-home post Budget 2026", category: "Tax Planning", slugHint: "35-lakh-ctc-structure-2026" },
    { topic: "How to structure ₹50 lakh CTC for maximum take-home post Budget 2026", category: "Tax Planning", slugHint: "50-lakh-ctc-structure-2026" },
    { topic: "Portfolio rebalancing guide for professionals with ₹50L+ investments", category: "Investment Basics", slugHint: "portfolio-rebalancing-50l-investments" },
    { topic: "Emergency fund sizing for ₹15L+ earners how many months and where to park it", category: "Personal Finance Foundations", slugHint: "emergency-fund-sizing-15l-earners" },
    { topic: "SIP top-up strategy to reach ₹5 crore by 50 with realistic returns", category: "Investment Basics", slugHint: "sip-topup-5-crore-50-years" },
    { topic: "Family floater vs individual health insurance for ₹15L+ earners with spouse and kids", category: "Insurance Planning", slugHint: "family-floater-vs-individual-health-2026" },
    { topic: "NRI tax obligations for Indian professionals working abroad FY 2025-26", category: "NRI Financial Planning", slugHint: "nri-tax-obligations-2026" },
    { topic: "Advance tax payment schedule and penalty calculation for salaried professionals", category: "Tax Planning", slugHint: "advance-tax-schedule-penalty" },
    { topic: "Form 26AS AIS TIS complete guide for salaried taxpayers FY 2025-26", category: "Tax Planning", slugHint: "form-26as-ais-tis-guide-2026" },
    { topic: "Debt funds taxation post 2023 changes what ₹15L+ earners should know", category: "Tax Planning", slugHint: "debt-funds-taxation-2026" },
    { topic: "Surrendering LIC endowment policy step by step financial decision framework", category: "Insurance Planning", slugHint: "surrender-lic-endowment-framework" },
    { topic: "Credit score maintenance for high income earners impact on home loans", category: "Debt Management & Credit Score", slugHint: "credit-score-high-income-earners" },
    { topic: "Budget 2026 capital gains tax changes complete breakdown", category: "Tax Planning", slugHint: "budget-2026-capital-gains-changes" },
    { topic: "EPF vs VPF vs NPS for long-term retirement planning comparison", category: "Retirement Planning", slugHint: "epf-vs-vpf-vs-nps-retirement" },
];

type GeneratedPost = {
    title: string;
    excerpt: string;
    key_takeaways: string[];
    content: string;
};

function getBedrockClient() {
    const region = process.env.BEDROCK_REGION || process.env.MYAPP_AWS_REGION || "us-east-1";
    const accessKeyId = process.env.BEDROCK_ACCESS_KEY_ID || process.env.DYNAMODB_ACCESS_KEY_ID;
    const secretAccessKey = process.env.BEDROCK_SECRET_ACCESS_KEY || process.env.DYNAMODB_SECRET_ACCESS_KEY;
    if (accessKeyId && secretAccessKey) {
        return new BedrockRuntimeClient({
            region,
            credentials: { accessKeyId, secretAccessKey },
        });
    }
    return new BedrockRuntimeClient({ region });
}

function pickTopicIndex(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return dayOfYear % TOPICS.length;
}

function sanitizeSebi(text: string): string {
    return text
        .replace(/SEBI[\s-]+Registered[\s-]+Investment[\s-]+Advis(?:o|e)rs?/gi, "qualified financial advisor")
        .replace(/SEBI[\s-]+registered[\s-]+(investment[\s-]+)?advis(?:o|e)rs?/gi, "qualified financial advisor")
        .replace(/SEBI[\s-]+RIAs?\b/gi, "qualified financial advisor")
        .replace(/\bSEBI[\s-]+Investment[\s-]+Advis(?:o|e)rs?\b/gi, "qualified financial advisor")
        .replace(/registered[\s-]+investment[\s-]+advis(?:o|e)rs?/gi, "qualified financial advisor")
        .replace(/\bRIAs?\b/g, "advisor")
        .replace(/\bSEBI\b/g, "")
        .replace(/https?:\/\/(www\.)?sebi\.gov\.in\S*/gi, "")
        .replace(/\[([^\]]*)\]\(\s*\)/g, "$1")
        .replace(/[ \t]{2,}/g, " ")
        .replace(/ ,/g, ",")
        .replace(/ \./g, ".");
}

function containsSebi(text: string): boolean {
    return /\bSEBI\b|\bRIA\b|registered\s+investment\s+advis(?:o|e)r/i.test(text);
}

async function slugExists(slug: string): Promise<boolean> {
    const res = await docClient.send(new GetCommand({ TableName: TABLES.POSTS, Key: { PK: `POST#${slug}` } }));
    return !!res.Item;
}

async function generatePost(topic: Topic): Promise<GeneratedPost> {
    const client = getBedrockClient();
    const userMessage = `Write a blog post for MyFinancial (myfinancial.in) targeting Indian professionals earning ₹15L+. Topic: "${topic.topic}".

Return STRICT JSON only — no prose, no code fences, no markdown wrapper:
{
  "title": "<SEO-friendly title under 80 chars>",
  "excerpt": "<one or two sentence summary for blog card, under 200 chars>",
  "key_takeaways": ["<takeaway 1>", "<takeaway 2>", "<takeaway 3>", "<takeaway 4>"],
  "content": "<full markdown body, 1000-1200 words, starts with a # H1 title>"
}

Body structure requirements:
- # H1 title on first line
- Strong direct hook paragraph
- ## Summary table (markdown table with 4-8 rows, numbers in ₹)
- ## Per-item breakdown with ### sub-headers, each with exact ₹ figures + action step
- ## Real example with a before/after salary or investment table when relevant
- ## What to do this week — numbered action plan
- ## Closing paragraph with a link to [/diagnosis] CTA

Rules:
- All numbers in Indian notation (₹, lakh, crore)
- Reference FY 2025-26 / Budget 2026 where applicable
- Cite relevant section numbers (80C, 80CCD, 10(14), etc.)
- Direct, punchy voice — not corporate
- NO phrases like "in this blog post" or "let's dive in"
- End with one CTA link to /diagnosis
- NEVER fabricate tax rates — use widely-known figures; if uncertain, use qualifying language like "approximately" or "around"
- NEVER mention "SEBI", "RIA", "SEBI Registered Investment Adviser", "SEBI-registered advisor", "registered investment adviser/advisor", or any variant. If a referral is needed, write "qualified financial advisor". Do not link to sebi.gov.in. Do not reference SEBI regulations, circulars, charters, or the SEBI IA framework.
- STRICT JSON only, no extra text around it`;

    const cmd = new ConverseCommand({
        modelId: MODEL_ID,
        system: [{ text: `You are the editorial voice of MyFinancial — direct, numbers-heavy, Indian-context, actionable.` }],
        messages: [{ role: "user", content: [{ text: userMessage }] }],
        inferenceConfig: { maxTokens: 6000, temperature: 0.7 },
    });

    const res = await client.send(cmd);
    const text = res.output?.message?.content?.[0]?.text || "";
    // Strip code fences if present, then isolate the outermost JSON object.
    const stripped = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    const firstBrace = stripped.indexOf("{");
    const lastBrace = stripped.lastIndexOf("}");
    const candidate = firstBrace >= 0 && lastBrace > firstBrace ? stripped.slice(firstBrace, lastBrace + 1) : stripped;

    let parsed: GeneratedPost;
    try {
        parsed = JSON.parse(candidate);
    } catch (e) {
        const stopReason = res.stopReason;
        throw new Error(`Bedrock JSON parse failed (stopReason=${stopReason}, length=${text.length}): ${text.slice(0, 300)}`);
    }

    if (!parsed.title || !parsed.content || !parsed.excerpt || !Array.isArray(parsed.key_takeaways)) {
        throw new Error("Generated post missing required fields");
    }

    return parsed;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const secret = process.env.CRON_SECRET;

    if (!secret) {
        return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
    }
    if (!token || token !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Rotate through topics starting from today's index; skip any that are already published.
        const startIdx = pickTopicIndex();
        let chosen: Topic | null = null;
        for (let i = 0; i < TOPICS.length; i++) {
            const t = TOPICS[(startIdx + i) % TOPICS.length];
            if (!(await slugExists(t.slugHint))) {
                chosen = t;
                break;
            }
        }
        if (!chosen) {
            return NextResponse.json({ skipped: true, reason: "All rotation topics already published" });
        }

        // Generate content via Bedrock
        const post = await generatePost(chosen);

        // Strip any SEBI/RIA references the model slipped in despite the prompt rule
        post.title = sanitizeSebi(post.title);
        post.excerpt = sanitizeSebi(post.excerpt);
        post.content = sanitizeSebi(post.content);
        post.key_takeaways = post.key_takeaways.map(sanitizeSebi);

        // Hard gate: refuse to publish if any residual SEBI/RIA mention survived sanitization
        const residualField = [post.title, post.excerpt, post.content, ...post.key_takeaways].find(containsSebi);
        if (residualField) {
            return NextResponse.json({
                skipped: true,
                reason: "Generated post contained un-sanitizable SEBI/RIA reference",
                preview: residualField.slice(0, 200),
            });
        }

        // Build final slug — prefer the rotation hint (stable/dedup-safe) over any slug the model invented
        const slug = chosen.slugHint;
        if (await slugExists(slug)) {
            return NextResponse.json({ skipped: true, reason: "Slug collision at publish time", slug });
        }

        const now = new Date().toISOString();
        const wordCount = (post.content || "").split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));

        const item = {
            PK: `POST#${slug}`,
            id: crypto.randomUUID(),
            title: post.title,
            slug,
            excerpt: post.excerpt,
            content: post.content,
            cover_image: null,
            category: chosen.category,
            tags: [chosen.category.toLowerCase().replace(/\s+/g, "-"), "fy-2025-26", "budget-2026"],
            author: AUTHOR,
            status: "published",
            reading_time: readingTime,
            likes: 0,
            key_takeaways: post.key_takeaways,
            published_at: now,
            created_at: now,
            updated_at: now,
        };

        await docClient.send(new PutCommand({ TableName: TABLES.POSTS, Item: item }));

        return NextResponse.json({
            published: true,
            slug,
            title: post.title,
            category: chosen.category,
            reading_time: readingTime,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Daily blog cron error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
