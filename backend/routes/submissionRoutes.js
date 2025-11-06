import express from 'express';
import { 
  submitAssignment, 
  getStudentSubmissions, 
  getAllSubmissions,
  updateSubmissionStatus,
  getSubmissionById
} from '../controllers/submissionController.js';
import { protect, admin, student } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/submit', protect, student, submitAssignment);
router.get('/student', protect, student, getStudentSubmissions);
router.get('/', protect, admin, getAllSubmissions);
router.get('/:id', protect, getSubmissionById);
router.put('/:id/status', protect, admin, updateSubmissionStatus);

export default router;