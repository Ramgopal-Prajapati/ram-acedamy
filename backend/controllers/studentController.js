import User from '../models/User.js';
import Course from '../models/Course.js';

export const createStudent = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      username, 
      password, 
      phone, 
      address,
      socials,
      assignedCourses 
    } = req.body;

    // Generate student ID
    const studentCount = await User.countDocuments({ role: 'student' });
    const studentId = `STU${String(studentCount + 1).padStart(3, '0')}`;

    // Process assigned courses with fees
    const coursesWithFees = [];
    if (assignedCourses && assignedCourses.length > 0) {
      for (const courseId of assignedCourses) {
        const course = await Course.findById(courseId);
        if (course) {
          coursesWithFees.push({
            course: courseId,
            startDate: new Date(),
            fees: {
              total: course.price,
              paid: 0,
              remaining: course.price
            }
          });
        }
      }
    }

    const student = new User({
      username,
      password,
      role: 'student',
      name,
      email,
      studentId,
      phone,
      address,
      socials: socials || {
        github: '',
        linkedin: '',
        instagram: ''
      },
      assignedCourses: coursesWithFees
    });

    await student.save();
    
    // Populate course details before sending response
    const populatedStudent = await User.findById(student._id)
      .populate('assignedCourses.course')
      .select('-password');

    res.status(201).json(populatedStudent);
  } catch (error) {
    console.error('Error in createStudent:', error);
    res.status(400).json({ message: 'Error creating student', error: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .populate('assignedCourses.course')
      .select('-password');
    
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .populate('assignedCourses.course')
      .select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      email, 
      phone, 
      address, 
      socials 
    } = req.body;

    const student = await User.findByIdAndUpdate(
      id, 
      { 
        name, 
        email, 
        phone, 
        address, 
        socials 
      }, 
      { new: true, runValidators: true }
    ).populate('assignedCourses.course').select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: 'Error updating student', error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateStudentFees = async (req, res) => {
  try {
    const { studentId, courseId, paidAmount } = req.body;

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find the course in student's assigned courses
    const courseIndex = student.assignedCourses.findIndex(
      ac => ac.course.toString() === courseId
    );

    if (courseIndex === -1) {
      return res.status(404).json({ message: 'Course not assigned to student' });
    }

    // Update fees
    student.assignedCourses[courseIndex].fees.paid = paidAmount;
    student.assignedCourses[courseIndex].fees.remaining = 
      student.assignedCourses[courseIndex].fees.total - paidAmount;

    await student.save();

    const updatedStudent = await User.findById(studentId)
      .populate('assignedCourses.course')
      .select('-password');

    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: 'Error updating fees', error: error.message });
  }
};

export const assignCourseToStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    
    const student = await User.findById(studentId);
    const course = await Course.findById(courseId);
    
    if (!student || !course) {
      return res.status(404).json({ message: 'Student or course not found' });
    }

    // Check if course already assigned
    const alreadyAssigned = student.assignedCourses.some(
      ac => ac.course.toString() === courseId
    );

    if (alreadyAssigned) {
      return res.status(400).json({ message: 'Course already assigned to student' });
    }

    // Add course with fees
    student.assignedCourses.push({
      course: courseId,
      startDate: new Date(),
      fees: {
        total: course.price,
        paid: 0,
        remaining: course.price
      }
    });

    await student.save();
    await student.populate('assignedCourses.course');

    res.json({ message: 'Course assigned successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeCourseFromStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.assignedCourses = student.assignedCourses.filter(
      ac => ac.course.toString() !== courseId
    );

    await student.save();
    await student.populate('assignedCourses.course');

    res.json({ message: 'Course removed successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};