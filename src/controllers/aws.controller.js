import * as s3Service from '../services/aws/s3.service.js';

export async function listS3Buckets(_req, res, next) {
  try {
    const buckets = await s3Service.listAllBuckets();
    res.json({ success: true, data: buckets });
  } catch (error) {
    next(error);
  }
}

export async function listS3Objects(req, res, next) {
  try {
    const objects = await s3Service.listObjects(req.query.prefix, req.query.bucket);
    res.json({ success: true, data: objects });
  } catch (error) {
    next(error);
  }
}

export async function getUploadPresignedUrl(req, res, next) {
  try {
    const data = await s3Service.getUploadPresignedUrl({
      key: req.body.key,
      contentType: req.body.contentType,
      expiresIn: req.body.expiresIn,
      bucket: req.body.bucket,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getDownloadPresignedUrl(req, res, next) {
  try {
    const data = await s3Service.getDownloadPresignedUrl({
      key: req.body.key || req.query.key,
      expiresIn: req.body.expiresIn || Number(req.query.expiresIn) || undefined,
      bucket: req.body.bucket || req.query.bucket,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteS3Object(req, res, next) {
  try {
    const key = req.body.key || req.query.key;
    const data = await s3Service.deleteObject(key, req.body.bucket || req.query.bucket);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
