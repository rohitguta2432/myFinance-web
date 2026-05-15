# Blog Thumbnails — Setup Notes

The daily-blog cron, admin post creation, and `/api/admin/backfill-thumbnails` generate thumbnails via **Pollinations.ai** (free, no API key, FLUX-backed) and upload them to S3. The AWS side is already provisioned — these notes are for reference.

## Pipeline

1. App constructs an editorial prompt from the post title + category.
2. `GET https://image.pollinations.ai/prompt/<encoded-prompt>?width=1280&height=720&model=flux&nologo=true&enhance=false&seed=<random>` returns a JPG.
3. App uploads the JPG to `s3://myfinancial-blog-assets/thumbnails/<slug>.jpg`.
4. `cover_image` is set to `https://myfinancial-blog-assets.s3.ap-south-1.amazonaws.com/thumbnails/<slug>.jpg`.

## AWS state (already done — recorded for handover)

| Resource | Value |
|---|---|
| S3 bucket | `myfinancial-blog-assets` |
| Region | `ap-south-1` (Mumbai) |
| Public-access block | Acls=block, Policy=allow |
| Bucket policy | `s3:GetObject` allowed for `*` on `/thumbnails/*` |
| IAM user | `myfinance-bedrock-user` (account `610405653642`) |
| IAM inline policy | `BlogThumbnailsS3` → `s3:PutObject` on `/thumbnails/*` |
| Image provider | Pollinations.ai (no AWS Bedrock dependency for thumbnails) |

The `BlogThumbnailsS3` inline policy attached to `myfinance-bedrock-user`:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:PutObject", "s3:PutObjectAcl"],
    "Resource": "arn:aws:s3:::myfinancial-blog-assets/thumbnails/*"
  }]
}
```

The bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadThumbnails",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::myfinancial-blog-assets/thumbnails/*"
  }]
}
```

## Env vars (defaults work — override only if needed)

| Var | Default | Purpose |
|---|---|---|
| `S3_BLOG_BUCKET` | `myfinancial-blog-assets` | bucket name |
| `S3_BLOG_REGION` | `ap-south-1` | bucket region |
| `POLLINATIONS_MODEL` | `flux` | image model (`flux`, `flux-realism`, `flux-anime`, `turbo`) |
| `S3_ACCESS_KEY_ID` | falls back to `BEDROCK_ACCESS_KEY_ID` | separate S3 IAM (optional) |
| `S3_SECRET_ACCESS_KEY` | falls back to `BEDROCK_SECRET_ACCESS_KEY` | separate S3 IAM (optional) |

## Backfill (one-time)

After deploy, fill in missing covers for posts already in DynamoDB:

```bash
curl -X POST 'https://myfinancial.in/api/admin/backfill-thumbnails' \
  -H 'Cookie: admin_session=<your-admin-session-cookie>'
```

Each call processes up to 20 posts. Repeat until `remaining: 0`. Pollinations rate-limits to ~1 req / 5s, so a 20-post batch takes ~2 minutes (Lambda max is 5 min).

To regenerate every post (e.g. style change):

```bash
curl -X POST 'https://myfinancial.in/api/admin/backfill-thumbnails?force=true&limit=10'
```

## Cost

- Pollinations.ai: **free** (rate-limited).
- S3 storage: ~$0.025/GB/mo. Each JPG is ~40-80KB → 30 posts ≈ 1.5MB ≈ $0.00004/mo.
- S3 GET egress: a few cents/mo at expected blog traffic.

Total: pennies per month, no per-image cost.

## Troubleshooting

- **Cron returns `{skipped: true, reason: "Thumbnail generation/upload failed..."}`** — Pollinations is throttling or down, or S3 PutObject failed. Check CloudWatch logs for the daily-blog Lambda.
- **Backfill returns `failed` for a row** — same; details in the `error` field of each result.
- **Image looks generic** — tweak the prompt in `src/lib/thumbnail-gen.ts:buildPrompt`. Each post uses a deterministic seed via `slug` — change the seed strategy if you want regenerable variants.
- **Want a different provider** — drop in OpenAI/Replicate/Stability by swapping `generateThumbnail` body in `src/lib/thumbnail-gen.ts`. S3 + IAM stay as-is.
