import { Router } from 'express';
import awsRoutes from './aws.routes.js';
import healthRoutes from './health.routes.js';
import userProfileRoutes from './userProfile.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/api/aws', awsRoutes);
router.use('/api/profiles', userProfileRoutes);

export default router;
