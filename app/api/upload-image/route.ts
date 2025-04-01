// app/api/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize the S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto', // R2 uses 'auto' for the region
  endpoint: process.env.R2_ENDPOINT, // e.g., https://<account-id>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'File name and type are required' },
        { status: 400 }
      );
    }

    // Define the path in the R2 bucket (e.g., images/testuser/12345-image.jpg)
    const path = `images/${fileName}`;

    // Generate a signed URL for uploading the image to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME, // e.g., spawnwrite-images
      Key: path,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60, // URL expires in 60 seconds
    });

    // Construct the public URL for the image
    const publicUrl = `https://${process.env.R2_CUSTOM_DOMAIN}/${path}`; // e.g., https://assets.spawnwrite.com/images/testuser/12345-image.jpg

    return NextResponse.json({
      signedUrl,
      publicUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to process image upload' },
      { status: 500 }
    );
  }
}