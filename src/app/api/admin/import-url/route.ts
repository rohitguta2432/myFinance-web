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
 * Recursively walks the DOM so nested wrappers (div, section, article)
 * are traversed instead of being dumped as a single paragraph.
 */
function htmlToMarkdown(html: string): string {
    const $ = cheerio.load(html);
    const lines: string[] = [];

    const CONTENT_TAGS = new Set([
        "h1", "h2", "h3", "h4", "h5", "h6",
        "p", "ul", "ol", "blockquote", "pre", "code",
        "img", "figure", "table",
    ]);

    const WRAPPER_TAGS = new Set([
        "div", "section", "article", "main", "span", "header", "footer", "aside",
    ]);

    function processElement(el: cheerio.Element) {
        const tag = (el as unknown as { tagName?: string }).tagName?.toLowerCase();
        if (!tag) return;

        const $el = $(el);
        const text = $el.text().trim();

        // Skip empty elements (except img)
        if (!text && tag !== "img" && tag !== "figure") return;

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
            case "p":
                if (text.length > 0) {
                    lines.push(text + "\n");
                }
                break;
            case "ul":
            case "ol":
                $el.children("li").each((i, li) => {
                    const liText = $(li).text().trim();
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
            case "figure": {
                const img = $el.find("img").first();
                const src = img.attr("src");
                const alt = img.attr("alt") || "";
                const caption = $el.find("figcaption").text().trim();
                if (src) lines.push(`![${alt || caption}](${src})\n`);
                break;
            }
            case "table": {
                // Extract table as simple markdown
                const rows: string[][] = [];
                $el.find("tr").each((_, tr) => {
                    const cells: string[] = [];
                    $(tr).find("th, td").each((_, cell) => {
                        cells.push($(cell).text().trim());
                    });
                    if (cells.length) rows.push(cells);
                });
                if (rows.length > 0) {
                    lines.push("| " + rows[0].join(" | ") + " |");
                    lines.push("| " + rows[0].map(() => "---").join(" | ") + " |");
                    for (let i = 1; i < rows.length; i++) {
                        lines.push("| " + rows[i].join(" | ") + " |");
                    }
                    lines.push("");
                }
                break;
            }
            default:
                // For wrapper tags, recurse into children
                if (WRAPPER_TAGS.has(tag)) {
                    $el.children().each((_, child) => {
                        processElement(child);
                    });
                } else if (text.length > 20) {
                    // Unknown tag with substantial text — treat as paragraph
                    lines.push(text + "\n");
                }
                break;
        }
    }

    $("body").children().each((_, el) => {
        processElement(el);
    });

    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
