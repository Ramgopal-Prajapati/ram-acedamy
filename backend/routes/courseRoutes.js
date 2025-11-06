import express from 'express';
import { 
  createCourse, 
  getAllCourses, 
  getCourseById,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, createCourse);
router.get('/', protect, getAllCourses);
router.get('/:id', protect, getCourseById);
router.put('/:id', protect, admin, updateCourse);
router.delete('/:id', protect, admin, deleteCourse);

export default router;