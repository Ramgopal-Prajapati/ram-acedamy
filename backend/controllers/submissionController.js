import Submission from '../models/Submission.js';
import Assignment from '../models/Assignment.js';

export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, githubUrl } = req.body;
    const studentId = req.user._id;

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if student is assigned to this assignment
    const isAssigned = assignment.assignedStudents.length === 0 || 
                      assignment.assignedStudents.includes(studentId);

    if (!isAssigned) {
      return res.status(403).json({ message: 'You are not assigned to this assignment' });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assignment: assignmentId,
      student: studentId
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'Assignment already submitted' });
    }

    const submission = new Submission({
      assignment: assignmentId,
      student: studentId,
      githubUrl,
      status: 'Pending'
    });

    await submission.save();
    await submission.populate('assignment');
    await submission.populate('student', 'name studentId email');
    
    res.status(201).json(submission);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(400).json({ message: 'Error submitting assignment', error: error.message });
  }
};

export const getStudentSubmissions = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    const submissions = await Submission.find({ student: studentId })
      .populate('assignment')
      .populate('student', 'name studentId email')
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('assignment')
      .populate('student', 'name studentId email')
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSubmissionStatus = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        feedback,
        reviewedAt: new Date()
      },
      { new: true }
    )
    .populate('assignment')
    .populate('student', 'name studentId email');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('assignment')
      .populate('student', 'name studentId email');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};