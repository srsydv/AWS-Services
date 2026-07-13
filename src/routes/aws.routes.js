import { Router } from 'express';
import { listS3Buckets } from '../controllers/aws.controller.js';

const router = Router();

router.get('/s3/buckets', listS3Buckets);

export default router;
