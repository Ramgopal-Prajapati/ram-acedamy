import User from '../models/User.js';
import Course from '../models/Course.js';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const pendingSubmissions = await Submission.countDocuments({ status: 'Pending' });

    // Get recent activities
    const recentSubmissions = await Submission.find()
      .populate('student', 'name studentId')
      .populate('assignment', 'title')
      .sort({ submittedAt: -1 })
      .limit(5);

    res.json({
      counts: {
        totalStudents,
        totalCourses,
        totalAssignments,
        pendingSubmissions
      },
      recentActivities: {
        submissions: recentSubmissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};