import { NextRequest, NextResponse } from "next/server";
import {
    BedrockRuntimeClient,
    InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { isAuthenticated } from "@/lib/admin-auth";

const MODEL_ID = "us.anthropic.claude-sonnet-4-20250514-v1:0";

function getBedrockClient() {
    return new BedrockRuntimeClient({
        region: process.env.BEDROCK_REGION || process.env.AWS_REGION || "us-east-1",
    });
}

type AiAction = "generate" | "improve" | "summarize";

const SYSTEM_PROMPT = `You are an expert Indian personal finance blog writer for "MyFinancial", a platform that helps Indians with financial planning.

Your writing style:
- Clear, conversational, and educational
- Use Indian financial terminology (₹, Lakh, Crore, PPF, EPF, NPS, ELSS, 80C, etc.)
- Reference Indian tax laws, regulations, and financial products
- Include practical actionable advice
- Use Markdown formatting with headers, bullet points, and bold text
- Write in a friendly, approachable tone — like advising a friend
- Always mention relevant disclaimers when discussing investments`;

function buildPrompt(
    action: AiAction,
    prompt: string,
    existingContent?: string
): string {
    switch (action) {
        case "generate":
            return `Write a comprehensive, well-structured blog post in Markdown about the following topic:

Topic: ${prompt}

Requirements:
- Start with an engaging introduction
- Use ## for section headers
- Include practical tips, examples with Indian context
- Add a clear conclusion with key takeaways
- Target 800-1200 words
- Make it SEO-friendly with natural keyword usage`;

        case "improve":
            return `Improve and polish the following blog post. Make it more engaging, better structured, and more professional while keeping the core message intact.

${prompt ? `Additional instructions: ${prompt}` : ""}

Existing content to improve:
---
${existingContent}
---

Return the improved version in full Markdown format.`;

        case "summarize":
            return `Create a compelling 1-2 sentence excerpt/summary for the following blog post. This will be shown as a preview on blog cards.

${prompt ? `Focus on: ${prompt}` : ""}

Content to summarize:
---
${existingContent}
---

Return ONLY the excerpt text, nothing else. Keep it under 200 characters.`;

        default:
            return prompt;
    }
}

export async function POST(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { prompt, existingContent, action } = body as {
            prompt: string;
            existingContent?: string;
            action: AiAction;
        };

        if (!prompt && !existingContent) {
            return NextResponse.json(
                { error: "A prompt or existing content is required" },
                { status: 400 }
            );
        }

        if (!["generate", "improve", "summarize"].includes(action)) {
            return NextResponse.json(
                { error: "Invalid action. Use: generate, improve, or summarize" },
                { status: 400 }
            );
        }

        const client = getBedrockClient();
        const userMessage = buildPrompt(action, prompt, existingContent);

        const command = new InvokeModelCommand({
            modelId: MODEL_ID,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 4096,
                temperature: action === "summarize" ? 0.3 : 0.7,
                system: SYSTEM_PROMPT,
                messages: [
                    {
                        role: "user",
                        content: userMessage,
                    },
                ],
            }),
        });

        const response = await client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        const generatedContent =
            responseBody.content?.[0]?.text || "No content generated.";

        // For "generate" action, try to extract title from the first heading
        let title: string | null = null;
        let excerpt: string | null = null;

        if (action === "generate") {
            const titleMatch = generatedContent.match(/^#\s+(.+)$/m);
            if (titleMatch) {
                title = titleMatch[1].trim();
            }
        }

        if (action === "summarize") {
            excerpt = generatedContent.trim();
        }

        return NextResponse.json({
            content: generatedContent,
            title,
            excerpt,
            action,
            model: MODEL_ID,
        });
    } catch (error) {
        console.error("AI Write error:", error);

        // Handle Bedrock-specific errors
        const message =
            error instanceof Error ? error.message : "AI generation failed";

        // Check for common Bedrock errors
        if (message.includes("AccessDeniedException")) {
            return NextResponse.json(
                {
                    error:
                        "Bedrock access denied. Ensure model access is enabled in AWS Bedrock console and IAM permissions are configured.",
                },
                { status: 403 }
            );
        }

        if (message.includes("ThrottlingException")) {
            return NextResponse.json(
                { error: "AI service is busy. Please try again in a few seconds." },
                { status: 429 }
            );
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
