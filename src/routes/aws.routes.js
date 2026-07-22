import { Router } from 'express';
import {
  deleteS3Object,
  getDownloadPresignedUrl,
  getUploadPresignedUrl,
  listS3Buckets,
  listS3Objects,
} from '../controllers/aws.controller.js';

const router = Router();

router.get('/s3/buckets', listS3Buckets);
router.get('/s3/objects', listS3Objects);

// Presigned URLs
router.post('/s3/presign/upload', getUploadPresignedUrl);
router.post('/s3/presign/download', getDownloadPresignedUrl);
router.get('/s3/presign/download', getDownloadPresignedUrl);

router.delete('/s3/objects', deleteS3Object);

export default router;
