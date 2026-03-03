import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { isAuthenticated } from "@/lib/admin-auth";

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
                    "Mozilla/5.0 (compatible; MyFinanceBlogImporter/1.0)",
                Accept: "text/html,application/xhtml+xml",
            },
            signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch URL (HTTP ${response.status})` },
                { status: 422 }
            );
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove scripts, styles, nav, footer, ads, etc.
        $(
            "script, style, nav, footer, header, aside, iframe, noscript, .ad, .ads, .advertisement, .sidebar, .comments, .related-posts"
        ).remove();

        // Extract title (priority order)
        const title =
            $("article h1").first().text().trim() ||
            $("h1").first().text().trim() ||
            $('meta[property="og:title"]').attr("content")?.trim() ||
            $("title").text().trim() ||
            "";

        // Extract excerpt / description
        const excerpt =
            $('meta[name="description"]').attr("content")?.trim() ||
            $('meta[property="og:description"]').attr("content")?.trim() ||
            "";

        // Extract cover image
        const coverImage =
            $('meta[property="og:image"]').attr("content")?.trim() ||
            $("article img").first().attr("src")?.trim() ||
            "";

        // Extract main content — try multiple selectors
        let contentHtml = "";
        const contentSelectors = [
            "article",
            '[role="main"]',
            ".post-content",
            ".article-content",
            ".entry-content",
            ".content-body",
            ".story-body",
            "main",
        ];

        for (const sel of contentSelectors) {
            const el = $(sel).first();
            if (el.length && el.text().trim().length > 200) {
                contentHtml = el.html() || "";
                break;
            }
        }

        // Fallback: use body
        if (!contentHtml) {
            contentHtml = $("body").html() || "";
        }

        // Convert HTML to clean Markdown-like text
        const content = htmlToMarkdown(contentHtml);

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

/**
 * Simple HTML → Markdown converter using cheerio.
 */
function htmlToMarkdown(html: string): string {
    const $content = cheerio.load(html);
    const lines: string[] = [];

    // Process elements top-down
    $content("body")
        .children()
        .each((_, el) => {
            const $el = $content(el);
            const tag = (el as unknown as { tagName?: string }).tagName?.toLowerCase();

            if (!tag) return;

            const text = $el.text().trim();
            if (!text) return;

            switch (tag) {
                case "h1":
                    lines.push(`# ${text}\n`);
                    break;
                case "h2":
                    lines.push(`## ${text}\n`);
                    break;
                case "h3":
                    lines.push(`### ${text}\n`);
                    break;
                case "h4":
                    lines.push(`#### ${text}\n`);
                    break;
                case "h5":
                case "h6":
                    lines.push(`##### ${text}\n`);
                    break;
                case "ul":
                case "ol":
                    $el.find("li").each((i, li) => {
                        const liText = $content(li).text().trim();
                        if (liText) {
                            lines.push(
                                tag === "ol" ? `${i + 1}. ${liText}` : `- ${liText}`
                            );
                        }
                    });
                    lines.push("");
                    break;
                case "blockquote":
                    lines.push(`> ${text}\n`);
                    break;
                case "pre":
                case "code":
                    lines.push("```\n" + text + "\n```\n");
                    break;
                case "img": {
                    const src = $el.attr("src");
                    const alt = $el.attr("alt") || "";
                    if (src) lines.push(`![${alt}](${src})\n`);
                    break;
                }
                default:
                    // paragraphs, divs, etc
                    if (text.length > 20) {
                        lines.push(text + "\n");
                    }
                    break;
            }
        });

    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
