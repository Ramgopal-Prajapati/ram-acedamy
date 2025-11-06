import Assignment from '../models/Assignment.js';

export const createAssignment = async (req, res) => {
  try {
    const { title, description, course, assignedStudents, dueDate } = req.body;

    const assignment = new Assignment({
      title,
      description,
      course,
      assignedStudents: assignedStudents || [],
      dueDate
    });

    await assignment.save();
    await assignment.populate('course');
    await assignment.populate('assignedStudents', 'name studentId email');
    
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(400).json({ message: 'Error creating assignment', error: error.message });
  }
};

export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('course')
      .populate('assignedStudents', 'name studentId email')
      .sort({ createdAt: -1 });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course')
      .populate('assignedStudents', 'name studentId email');
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('course')
    .populate('assignedStudents', 'name studentId email');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating assignment', error: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    const assignments = await Assignment.find({
      $or: [
        { assignedStudents: { $in: [studentId] } },
        { assignedStudents: { $size: 0 } } // Assignments for all students
      ]
    })
    .populate('course')
    .populate('assignedStudents', 'name studentId email')
    .sort({ dueDate: 1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};