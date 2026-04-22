import { QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLES } from "@/lib/dynamodb";
import type { BlogPost } from "@/lib/types";

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const result = await docClient.send(
            new GetCommand({
                TableName: TABLES.POSTS,
                Key: { PK: `POST#${slug}` },
            }),
        );
        if (!result.Item || result.Item.status !== "published") return null;
        return result.Item as BlogPost;
    } catch (err) {
        console.error("getPostBySlug error:", err);
        return null;
    }
}

export async function listPublishedPosts(): Promise<BlogPost[]> {
    try {
        const result = await docClient.send(
            new QueryCommand({
                TableName: TABLES.POSTS,
                IndexName: "status-published_at-index",
                KeyConditionExpression: "#s = :published",
                ExpressionAttributeNames: { "#s": "status" },
                ExpressionAttributeValues: { ":published": "published" },
                ScanIndexForward: false,
            }),
        );
        return (result.Items as BlogPost[]) || [];
    } catch (err) {
        console.error("listPublishedPosts error:", err);
        return [];
    }
}

export async function getRelatedPosts(
    category: string,
    excludeId: string,
    limit = 3,
): Promise<BlogPost[]> {
    const all = await listPublishedPosts();
    return all.filter((p) => p.category === category && p.id !== excludeId).slice(0, limit);
}
