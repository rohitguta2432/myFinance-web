import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: process.env.MYAPP_AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID || process.env.BEDROCK_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY || process.env.BEDROCK_SECRET_ACCESS_KEY || "",
    },
});

export const docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
});

export const TABLES = {
    POSTS: "myfinancial-blog-posts",
    COMMENTS: "myfinancial-comments",
    NEWSLETTER_SUBSCRIBERS: "myfinancial-newsletter-subscribers",
    /**
     * Anonymous TaxBuddy interstitial event log.
     * Schema: PK = `EVENT#<eventId>`, SK = ISO timestamp.
     * No PII — only `anonSessionToken` (browser-local random UUID) + event metadata.
     * See docs/compliance/taxbuddy-redirect/05-audit-trail-schema.md
     */
    TAXBUDDY_EVENTS: "myfinancial-taxbuddy-events",
} as const;
