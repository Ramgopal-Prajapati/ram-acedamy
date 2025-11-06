import express from 'express';
import { 
  createPayment, 
  getStudentPayments, 
  getAllPayments 
} from '../controllers/paymentController.js';
import { protect, admin, student } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, createPayment);
router.get('/student', protect, student, getStudentPayments);
router.get('/all', protect, admin, getAllPayments);

export default router;