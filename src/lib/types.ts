export type BlogCategory =
    | "Tax Saving"
    | "Investing"
    | "Budgeting"
    | "Insurance"
    | "NPS & Retirement"
    | "General";

export const BLOG_CATEGORIES: BlogCategory[] = [
    "Tax Saving",
    "Investing",
    "Budgeting",
    "Insurance",
    "NPS & Retirement",
    "General",
];

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image: string | null;
    category: BlogCategory;
    tags: string[];
    author: string;
    status: "draft" | "published";
    reading_time: number;
    likes: number;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: string;
    post_id: string;
    parent_id: string | null;
    author_name: string;
    author_email: string | null;
    content: string;
    is_admin: boolean;
    likes: number;
    created_at: string;
    replies?: Comment[];
}
