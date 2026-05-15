# S3 Setup — AI Blog Thumbnails

The daily-blog cron, admin post creation, and `/api/admin/backfill-thumbnails` all generate thumbnails via Bedrock Nova Canvas and upload them to S3. You need to provision the bucket and grant the existing IAM principal `s3:PutObject` once. After that everything is automatic.

## One-time AWS setup

### 1. Create the bucket (region: ap-south-1 / Mumbai)

```bash
aws s3api create-bucket \
  --bucket myfinancial-blog-assets \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1
```

### 2. Allow public-read on `thumbnails/*`

S3 blocks public access by default. Unblock the policy layer (object ACLs stay locked):

```bash
aws s3api put-public-access-block \
  --bucket myfinancial-blog-assets \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

Apply the bucket policy:

```bash
aws s3api put-bucket-policy \
  --bucket myfinancial-blog-assets \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Sid": "PublicReadThumbnails",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::myfinancial-blog-assets/thumbnails/*"
    }]
  }'
```

### 3. Grant the app's IAM user `s3:PutObject` on the bucket

The app reuses the same IAM credentials as Bedrock/DynamoDB (env vars `BEDROCK_ACCESS_KEY_ID` / `DYNAMODB_ACCESS_KEY_ID`). Attach this inline policy to that IAM user:

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

### 4. Enable Bedrock Nova Canvas in us-east-1

Nova Canvas is only available in `us-east-1`. The IAM user already has Bedrock access, but the model itself needs to be enabled for the account:

AWS Console → Bedrock → Model access → Edit → enable **Amazon · Nova Canvas** → Save.

## Env vars (optional — defaults work)

Add to Amplify env vars only if you want to override the defaults:

| Var | Default | Purpose |
|-----|---------|---------|
| `S3_BLOG_BUCKET` | `myfinancial-blog-assets` | bucket name |
| `S3_BLOG_REGION` | `ap-south-1` | bucket region |
| `BEDROCK_CANVAS_REGION` | `us-east-1` | Nova Canvas region |
| `S3_ACCESS_KEY_ID` | falls back to `BEDROCK_ACCESS_KEY_ID` | separate S3 IAM (optional) |
| `S3_SECRET_ACCESS_KEY` | falls back to `BEDROCK_SECRET_ACCESS_KEY` | separate S3 IAM (optional) |

## Verify

After deploy:

```bash
# Trigger one backfill batch (processes 20 posts per call)
curl -X POST 'https://myfinancial.in/api/admin/backfill-thumbnails' \
  -H 'Cookie: admin_session=<your-admin-session>'
```

Repeat until `remaining: 0`. Each call: ~$0.04 × 20 images = ~$0.80 worst case. Already-thumbed posts are skipped.

To regenerate all (e.g. style change):

```bash
curl -X POST 'https://myfinancial.in/api/admin/backfill-thumbnails?force=true&limit=10'
```

## Cost

- Nova Canvas: ~$0.04 per 1280×720 image (us-east-1).
- S3 storage: ~$0.025/GB/mo. Each PNG is ~200–500KB → 30 posts ≈ 15MB ≈ $0.0004/mo.
- S3 cross-region GET from CloudFront/users: negligible at this scale.

Total: a few cents per month + $0.04 per new blog post.
