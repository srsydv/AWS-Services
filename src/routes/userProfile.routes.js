import { Router } from 'express';
import {
  createProfile,
  deleteProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
} from '../controllers/userProfile.controller.js';

const router = Router();

router.post('/', createProfile);
router.get('/', getAllProfiles);
router.get('/:id', getProfileById);
router.put('/:id', updateProfile);
router.delete('/:id', deleteProfile);

export default router;
