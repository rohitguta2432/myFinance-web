export type BlogCategory =
    | "Tax Saving"
    | "Investing"
    | "Budgeting"
    | "Insurance"
    | "NPS & Retirement"
    | "Personal Finance Foundations"
    | "Income & Cash Flow Management"
    | "Investment Basics"
    | "Mutual Funds Investing"
    | "Stock Market Investing"
    | "Tax Planning"
    | "Retirement Planning"
    | "Insurance Planning"
    | "Debt Management & Credit Score"
    | "NRI Financial Planning"
    | "Behavioral Finance & Money Psychology"
    | "MyFinancial Services & Financial Diagnostics"
    | "General";

export const BLOG_CATEGORIES: BlogCategory[] = [
    "Personal Finance Foundations",
    "Income & Cash Flow Management",
    "Investment Basics",
    "Mutual Funds Investing",
    "Stock Market Investing",
    "Tax Planning",
    "Retirement Planning",
    "Insurance Planning",
    "Debt Management & Credit Score",
    "NRI Financial Planning",
    "Behavioral Finance & Money Psychology",
    "MyFinancial Services & Financial Diagnostics",
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
