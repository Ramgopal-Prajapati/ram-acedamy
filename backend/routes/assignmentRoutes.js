import express from 'express';
import { 
  createAssignment, 
  getAllAssignments, 
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getStudentAssignments
} from '../controllers/assignmentController.js';
import { protect, admin, student } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, createAssignment);
router.get('/', protect, admin, getAllAssignments);
router.get('/student', protect, student, getStudentAssignments);
router.get('/:id', protect, getAssignmentById);
router.put('/:id', protect, admin, updateAssignment);
router.delete('/:id', protect, admin, deleteAssignment);

export default router;