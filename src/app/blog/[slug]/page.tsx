import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostClient } from "./blog-post-client";
import { getPostBySlug, getRelatedPosts, listPublishedPosts } from "@/lib/blog-data";

export const revalidate = 86400;
export const dynamicParams = true;

const SITE_URL = "https://myfinancial.in";
const AUTHOR_NAME = "Nithin Pushkaran";
const AUTHOR_URL = `${SITE_URL}/about`;
const BRAND_AUTHORS = new Set(["MyFinancial", "myfinancial", ""]);

function resolveAuthorDisplay(raw: string | undefined): string {
    if (!raw) return AUTHOR_NAME;
    return BRAND_AUTHORS.has(raw.trim()) ? AUTHOR_NAME : raw;
}

export async function generateStaticParams() {
    const posts = await listPublishedPosts();
    return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: "Article not found",
            description: "This article doesn't exist or has been removed.",
            robots: { index: false, follow: true },
        };
    }

    const url = `${SITE_URL}/blog/${post.slug}`;
    const image = post.cover_image || `${SITE_URL}/og-default.png`;
    const authorDisplay = resolveAuthorDisplay(post.author);

    return {
        title: post.title,
        description: post.excerpt,
        authors: [{ name: authorDisplay, url: AUTHOR_URL }],
        alternates: { canonical: `/blog/${post.slug}` },
        openGraph: {
            type: "article",
            url,
            title: post.title,
            description: post.excerpt,
            siteName: "MyFinancial",
            locale: "en_IN",
            images: [{ url: image, width: 1200, height: 630, alt: post.title }],
            publishedTime: post.published_at || post.created_at,
            modifiedTime: post.updated_at || post.published_at || post.created_at,
            authors: [AUTHOR_URL],
            tags: post.tags,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [image],
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) notFound();

    const related = await getRelatedPosts(post.category, post.id, 3);
    const authorDisplay = resolveAuthorDisplay(post.author);
    const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
    const image = post.cover_image || `${SITE_URL}/og-default.png`;

    const blogPostingSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: [image],
        datePublished: post.published_at || post.created_at,
        dateModified: post.updated_at || post.published_at || post.created_at,
        author: {
            "@type": "Person",
            name: authorDisplay,
            url: AUTHOR_URL,
            jobTitle: "Founder, MyFinancial",
            hasCredential: {
                "@type": "EducationalOccupationalCredential",
                credentialCategory: "certification",
                name: "NISM Certified",
            },
        },
        publisher: {
            "@type": "Organization",
            name: "MyFinancial",
            url: SITE_URL,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/myfinancial-logo.svg`,
            },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
        url: canonicalUrl,
        keywords: (post.tags || []).join(", "),
        articleSection: post.category,
        inLanguage: "en-IN",
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <BlogPostClient post={post} related={related} authorDisplay={authorDisplay} />
        </>
    );
}
