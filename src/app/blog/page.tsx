import { BookOpen } from "lucide-react";
import { listPublishedPosts } from "@/lib/blog-data";
import { BlogListClient } from "@/components/blog/blog-list-client";

// Re-fetch from DynamoDB every 5 min — new posts appear quickly but every request doesn't hit Dynamo.
export const revalidate = 300;

export default async function BlogPage() {
    const posts = await listPublishedPosts();

    return (
        <section className="section-padding" style={{ minHeight: "80vh" }}>
            <div className="container-marketing">
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <span className="badge badge-accent" style={{ marginBottom: 16, display: "inline-flex" }}>
                        <BookOpen size={14} />
                        Insights & Guides
                    </span>
                    <h1 className="text-h1" style={{ marginBottom: 12 }}>
                        Financial Wisdom,{" "}
                        <span style={{ color: "#10B981" }}>One Article at a Time</span>
                    </h1>
                    <p className="text-body-lg" style={{ color: "#94A3B8", maxWidth: 560, margin: "0 auto" }}>
                        Expert tips on budgeting, tax saving, insurance, investing and more — tailored for India.
                    </p>
                </div>

                {/* SEO baseline — full list as plain links so bots see real content
                    even before client-side hydration takes over. Hidden visually. */}
                {posts.length > 0 && (
                    <nav aria-label="All articles (text index for search engines)" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
                        <ul>
                            {posts.map((p) => (
                                <li key={p.id}>
                                    <a href={`/blog/${p.slug}`}>{p.title}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}

                <BlogListClient initialPosts={posts} />
            </div>
        </section>
    );
}
