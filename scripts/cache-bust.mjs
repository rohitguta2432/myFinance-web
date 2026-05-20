import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const v = Date.now();

const scan = await ddb.send(new ScanCommand({ TableName: "myfinancial-blog-posts" }));
const items = (scan.Items || []).filter((p) => p.cover_image && p.slug);
console.log(`Cache-busting ${items.length} posts with v=${v}\n`);

for (const post of items) {
    const base = String(post.cover_image).split("?")[0];
    const newUrl = `${base}?v=${v}`;
    await ddb.send(new UpdateCommand({
        TableName: "myfinancial-blog-posts",
        Key: { PK: post.PK },
        UpdateExpression: "SET cover_image = :c, updated_at = :u",
        ExpressionAttributeValues: { ":c": newUrl, ":u": new Date().toISOString() },
    }));
    console.log(`✓ ${post.slug}`);
}
console.log(`\nDone. ${items.length} URLs updated.`);
