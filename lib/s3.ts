import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const KEY_PREFIX = "rcoe/boesa";

export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const bucket = process.env.AWS_S3_BUCKET_NAME!;
  const fullKey = `${KEY_PREFIX}/${key}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: fullKey,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fullKey}`;
}
