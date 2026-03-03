import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAuthenticated } from "@/lib/admin-auth";

function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    // Use service role key if available (bypasses RLS), otherwise anon key
    return createClient(url, serviceKey || anonKey);
}

// GET — List all posts (drafts + published)
export async function GET(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// POST — Create new post
export async function POST(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const supabase = getAdminClient();

    // Calculate reading time (~200 words per minute)
    const wordCount = (body.content || "").split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const postData = {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        cover_image: body.cover_image || null,
        category: body.category || "General",
        tags: body.tags || [],
        author: body.author || "MyFinancial",
        status: body.status || "draft",
        reading_time: readingTime,
        published_at: body.status === "published" ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase.from("blog_posts").insert(postData).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}

// PUT — Update post
export async function PUT(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const supabase = getAdminClient();

    if (!body.id) {
        return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    // Calculate reading time
    const wordCount = (body.content || "").split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const updateData: Record<string, unknown> = {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        cover_image: body.cover_image || null,
        category: body.category || "General",
        tags: body.tags || [],
        author: body.author || "MyFinancial",
        status: body.status,
        reading_time: readingTime,
        updated_at: new Date().toISOString(),
    };

    // Set published_at when first published
    if (body.status === "published" && !body.published_at) {
        updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from("blog_posts")
        .update(updateData)
        .eq("id", body.id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// DELETE — Delete post
export async function DELETE(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
