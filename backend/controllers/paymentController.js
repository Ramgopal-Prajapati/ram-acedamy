import Payment from '../models/Payment.js';
import User from '../models/User.js';

export const createPayment = async (req, res) => {
  try {
    const { studentId, courseId, amount, paymentMethod, transactionId } = req.body;

    const payment = new Payment({
      studentId,
      courseId,
      amount,
      paymentMethod,
      transactionId
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Error recording payment', error: error.message });
  }
};

export const getStudentPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.user._id })
      .populate('courseId')
      .sort({ paymentDate: -1 });
    
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Get student's assigned courses total fees
    const student = await User.findById(req.user._id).populate('assignedCourses');
    const totalFees = student.assignedCourses.reduce((sum, course) => sum + course.totalFees, 0);
    
    res.json({
      payments,
      summary: {
        totalFees,
        totalPaid,
        remainingFees: totalFees - totalPaid
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('studentId', 'name email studentId')
      .populate('courseId')
      .sort({ paymentDate: -1 });
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};