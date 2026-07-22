import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListDirectoryBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getAwsClientConfig } from '../../config/aws.js';
import { env } from '../../config/env.js';

/**
 * Shared S3 client — reuse this everywhere instead of creating a new client per request.
 * Credentials come from env (or the EC2 instance role if keys are empty).
 */
export const s3Client = new S3Client(getAwsClientConfig());

function getBucket(bucket) {
  const name = bucket || env.aws.s3Bucket;
  if (!name) {
    const error = new Error('S3 bucket is required. Pass bucket or set AWS_S3_BUCKET in .env');
    error.statusCode = 400;
    throw error;
  }
  return name;
}

function isDirectoryBucket(bucket) {
  return String(bucket).endsWith('--x-s3');
}

/** General purpose buckets only (classic S3). */
export async function listBuckets() {
  const response = await s3Client.send(new ListBucketsCommand({}));
  return response.Buckets ?? [];
}

/**
 * Directory / S3 Express One Zone buckets (names end with --x-s3).
 * Needs IAM permission: s3express:ListAllMyDirectoryBuckets
 */
export async function listDirectoryBuckets() {
  const response = await s3Client.send(new ListDirectoryBucketsCommand({}));
  return response.Buckets ?? [];
}

/** Combined list for learning / Postman. */
export async function listAllBuckets() {
  const [generalPurposeResult, directoryResult] = await Promise.allSettled([
    listBuckets(),
    listDirectoryBuckets(),
  ]);

  return {
    generalPurpose:
      generalPurposeResult.status === 'fulfilled' ? generalPurposeResult.value : [],
    directory: directoryResult.status === 'fulfilled' ? directoryResult.value : [],
    errors: {
      ...(generalPurposeResult.status === 'rejected'
        ? { generalPurpose: generalPurposeResult.reason.message }
        : {}),
      ...(directoryResult.status === 'rejected'
        ? { directory: directoryResult.reason.message }
        : {}),
    },
  };
}

export async function listObjects(prefix = '', bucket) {
  const bucketName = getBucket(bucket);

  const response = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix || undefined,
    }),
  );
  return response.Contents ?? [];
}

/**
 * Presigned PUT URL — works best with general purpose buckets.
 * Directory buckets (S3 Express) use session-based auth and are a poor fit for learning.
 */
export async function getUploadPresignedUrl({
  key,
  contentType = 'application/octet-stream',
  expiresIn = 300,
  bucket,
}) {
  if (!key) {
    const error = new Error('key is required (e.g. "uploads/photo.jpg")');
    error.statusCode = 400;
    throw error;
  }

  const bucketName = getBucket(bucket);

  if (isDirectoryBucket(bucketName)) {
    const error = new Error(
      'Presigned URLs work best with a General purpose bucket. Create one in S3 → General purpose buckets (not Directory buckets).',
    );
    error.statusCode = 400;
    throw error;
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });

  return {
    url,
    method: 'PUT',
    key,
    bucket: bucketName,
    contentType,
    expiresIn,
  };
}

/**
 * Presigned GET URL — temporary download / view link for a private object.
 */
export async function getDownloadPresignedUrl({
  key,
  expiresIn = 300,
  bucket,
}) {
  if (!key) {
    const error = new Error('key is required (e.g. "uploads/photo.jpg")');
    error.statusCode = 400;
    throw error;
  }

  const bucketName = getBucket(bucket);

  if (isDirectoryBucket(bucketName)) {
    const error = new Error(
      'Presigned URLs work best with a General purpose bucket. Create one in S3 → General purpose buckets (not Directory buckets).',
    );
    error.statusCode = 400;
    throw error;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });

  return {
    url,
    method: 'GET',
    key,
    bucket: bucketName,
    expiresIn,
  };
}

export async function deleteObject(key, bucket) {
  if (!key) {
    const error = new Error('key is required');
    error.statusCode = 400;
    throw error;
  }

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: getBucket(bucket),
      Key: key,
    }),
  );

  return { key, deleted: true };
}
