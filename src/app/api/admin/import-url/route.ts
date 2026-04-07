import { NextRequest, NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { isAuthenticated } from "@/lib/admin-auth";

// Configure Turndown for clean Markdown output
const turndown = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
});
turndown.use(gfm);

export async function POST(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { url } = await request.json();

        if (!url || typeof url !== "string") {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Validate URL format
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
        } catch {
            return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
        }

        // Fetch the page HTML
        const response = await fetch(parsedUrl.toString(), {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
            redirect: "follow",
            signal: AbortSignal.timeout(30000),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch URL (HTTP ${response.status})` },
                { status: 422 }
            );
        }

        const html = await response.text();

        // Parse with JSDOM and extract with Readability (same engine as Firefox Reader View)
        const dom = new JSDOM(html, { url: parsedUrl.toString() });
        const doc = dom.window.document;

        // Extract metadata before Readability modifies the DOM
        const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content")?.trim() || "";
        const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute("content")?.trim() || "";
        const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || "";
        const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content")?.trim() || "";

        // Extract article using Readability
        const reader = new Readability(doc);
        const article = reader.parse();

        if (!article || !article.content) {
            return NextResponse.json(
                { error: "Could not extract article content from this URL" },
                { status: 422 }
            );
        }

        // Convert extracted HTML to Markdown
        const content = turndown.turndown(article.content);

        // Build title (Readability's title is usually the best)
        const title = article.title || ogTitle || doc.title || "";

        // Build excerpt
        const excerpt = article.excerpt || ogDesc || metaDesc || "";

        // Build cover image
        let coverImage = ogImage;
        if (!coverImage) {
            // Try to find the first image in the extracted content
            const contentDom = new JSDOM(article.content);
            const firstImg = contentDom.window.document.querySelector("img");
            coverImage = firstImg?.getAttribute("src") || "";
        }

        return NextResponse.json({
            title,
            excerpt: excerpt.slice(0, 300),
            content,
            cover_image: coverImage || null,
            source_url: url,
        });
    } catch (error) {
        console.error("Import URL error:", error);
        const message =
            error instanceof Error ? error.message : "Failed to import content";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
