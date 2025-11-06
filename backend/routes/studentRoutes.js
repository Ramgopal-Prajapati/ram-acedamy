import express from 'express';
import { 
  createStudent, 
  getAllStudents, 
  getStudentById,
  updateStudent,
  deleteStudent,
  updateStudentFees,
  assignCourseToStudent,
  removeCourseFromStudent
} from '../controllers/studentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, createStudent);
router.get('/', protect, admin, getAllStudents);
router.get('/:id', protect, getStudentById);
router.put('/:id', protect, admin, updateStudent);
router.delete('/:id', protect, admin, deleteStudent);
router.post('/update-fees', protect, admin, updateStudentFees);
router.post('/assign-course', protect, admin, assignCourseToStudent);
router.post('/remove-course', protect, admin, removeCourseFromStudent);

export default router;