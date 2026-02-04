import express from 'express';
import {
  createEvidence,
  getAllEvidence,
  getEvidenceById,
  updateEvidence,
  verifyEvidence,
  rejectEvidence,
  deleteEvidence,
  downloadEvidence
} from '../controllers/evidence.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllEvidence)
  .post(upload.single('file'), createEvidence);

router.route('/:id')
  .get(getEvidenceById)
  .put(updateEvidence)
  .delete(authorize('Admin', 'Investigator'), deleteEvidence);

router.put('/:id/verify', authorize('Admin', 'Investigator'), verifyEvidence);
router.put('/:id/reject', authorize('Admin', 'Investigator'), rejectEvidence);
router.get('/:id/download', downloadEvidence);

export default router;
