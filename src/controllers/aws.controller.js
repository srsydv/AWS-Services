import * as s3Service from '../services/aws/s3.service.js';

export async function listS3Buckets(_req, res, next) {
  try {
    const buckets = await s3Service.listBuckets();
    res.json({ success: true, data: buckets });
  } catch (error) {
    next(error);
  }
}
