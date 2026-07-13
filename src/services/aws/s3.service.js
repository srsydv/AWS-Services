import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { getAwsClientConfig } from '../../config/aws.js';

const s3Client = new S3Client(getAwsClientConfig());

export async function listBuckets() {
  const response = await s3Client.send(new ListBucketsCommand({}));
  return response.Buckets ?? [];
}
