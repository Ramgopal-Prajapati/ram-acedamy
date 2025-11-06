import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { 
  FaPlus, 
  FaUserGraduate, 
  FaEnvelope, 
  FaIdCard, 
  FaEdit, 
  FaTrash,
  FaMoneyBill,
  FaBook,
  FaPhone,
  FaMapMarkerAlt,
  FaSave,
  FaTimes,
  FaGithub,
  FaLinkedin,
  FaInstagram
} from 'react-icons/fa';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    address: '',
    socials: {
      github: '',
      linkedin: '',
      instagram: ''
    },
    assignedCourses: []
  });
  const [feeData, setFeeData] = useState({
    courseId: '',
    paidAmount: 0
  });

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/students', formData);
      setShowForm(false);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Error creating student: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/students/${editingStudent._id}`, formData);
      setEditingStudent(null);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${studentId}`);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleFeeUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students/update-fees', {
        studentId: selectedStudent._id,
        courseId: feeData.courseId,
        paidAmount: Number(feeData.paidAmount)
      });
      setShowFeeForm(false);
      setFeeData({ courseId: '', paidAmount: 0 });
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Error updating fees:', error);
      alert('Error updating fees: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddCourse = async (studentId, courseId) => {
    try {
      await api.post('/students/assign-course', { studentId, courseId });
      fetchStudents();
    } catch (error) {
      console.error('Error assigning course:', error);
      alert('Error assigning course: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRemoveCourse = async (studentId, courseId) => {
    try {
      await api.post('/students/remove-course', { studentId, courseId });
      fetchStudents();
    } catch (error) {
      console.error('Error removing course:', error);
      alert('Error removing course: ' + (error.response?.data?.message || error.message));
    }
  };

  const startEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      username: student.username,
      password: '',
      phone: student.phone || '',
      address: student.address || '',
      socials: student.socials || { github: '', linkedin: '', instagram: '' }
    });
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      phone: '',
      address: '',
      socials: {
        github: '',
        linkedin: '',
        instagram: ''
      },
      assignedCourses: []
    });
  };

  const openFeeForm = (student) => {
    setSelectedStudent(student);
    setShowFeeForm(true);
  };

  const handleCourseSelection = (courseId) => {
    const currentCourses = [...formData.assignedCourses];
    if (currentCourses.includes(courseId)) {
      setFormData({
        ...formData,
        assignedCourses: currentCourses.filter(id => id !== courseId)
      });
    } else {
      setFormData({
        ...formData,
        assignedCourses: [...currentCourses, courseId]
      });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Student Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          <FaPlus style={{ marginRight: '8px' }} />
          Add Student
        </button>
      </div>

      {/* Add Student Form */}
      {showForm && (
        <div className="glass-card" style={{ padding: '25px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Add New Student</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1234567890"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                className="form-input"
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Full address"
              />
            </div>

            {/* Course Selection */}
            <div className="form-group">
              <label className="form-label">Assign Courses *</label>
              <div style={{ 
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '15px',
                background: 'var(--secondary-bg)',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {courses.map(course => (
                  <div key={course._id} style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.assignedCourses.includes(course._id)}
                        onChange={() => handleCourseSelection(course._id)}
                      />
                      <div>
                        <div style={{ fontWeight: '500' }}>{course.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Duration: {course.duration} | Price: ₹{course.price}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
                {formData.assignedCourses.length} course(s) selected
              </div>
            </div>

            <h4 style={{ margin: '20px 0 10px 0' }}>Social Media Links</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.socials.github}
                  onChange={(e) => setFormData({
                    ...formData, 
                    socials: {...formData.socials, github: e.target.value}
                  })}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.socials.linkedin}
                  onChange={(e) => setFormData({
                    ...formData, 
                    socials: {...formData.socials, linkedin: e.target.value}
                  })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Instagram URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.socials.instagram}
                  onChange={(e) => setFormData({
                    ...formData, 
                    socials: {...formData.socials, instagram: e.target.value}
                  })}
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Student'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Student Form */}
      {editingStudent && (
        <div className="glass-card" style={{ padding: '25px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Edit Student: {editingStudent.name}</h3>
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                className="form-input"
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <h4 style={{ margin: '20px 0 10px 0' }}>Social Media Links</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.socials.github}
                  onChange={(e) => setFormData({
                    ...formData, 
                    socials: {...formData.socials, github: e.target.value}
                  })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.socials.linkedin}
                  onChange={(e) => setFormData({
                    ...formData, 
                    socials: {...formData.socials, linkedin: e.target.value}
                  })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Instagram URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.socials.instagram}
                  onChange={(e) => setFormData({
                    ...formData, 
                    socials: {...formData.socials, instagram: e.target.value}
                  })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary">
                <FaSave style={{ marginRight: '5px' }} />
                Update Student
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={cancelEdit}
              >
                <FaTimes style={{ marginRight: '5px' }} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Fee Update Form */}
      {showFeeForm && selectedStudent && (
        <div className="glass-card" style={{ padding: '25px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Update Fees: {selectedStudent.name}</h3>
          <form onSubmit={handleFeeUpdate}>
            <div style={{ display: 'grid', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Select Course</label>
                <select
                  className="form-input"
                  value={feeData.courseId}
                  onChange={(e) => setFeeData({...feeData, courseId: e.target.value})}
                  required
                >
                  <option value="">Select Course</option>
                  {selectedStudent.assignedCourses?.map(ac => (
                    <option key={ac.course?._id} value={ac.course?._id}>
                      {ac.course?.title} (Total: ₹{ac.fees?.total}, Paid: ₹{ac.fees?.paid})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Paid Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={feeData.paidAmount}
                  onChange={(e) => setFeeData({...feeData, paidAmount: e.target.value})}
                  required
                  min="0"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary">
                Update Fees
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowFeeForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Students List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {students.map((student) => (
          <div key={student._id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <FaUserGraduate className="gradient-text" />
                  <h3 style={{ margin: 0 }}>{student.name}</h3>
                  <span style={{ 
                    background: 'var(--secondary-bg)', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {student.studentId}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaEnvelope style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{student.email}</span>
                  </div>
                  {student.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaPhone style={{ color: 'var(--text-secondary)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{student.phone}</span>
                    </div>
                  )}
                </div>

                {student.address && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                    <FaMapMarkerAlt style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {student.address}
                    </span>
                  </div>
                )}

                {/* Social Links */}
                {(student.socials?.github || student.socials?.linkedin || student.socials?.instagram) && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    {student.socials.github && (
                      <a href={student.socials.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
                        <FaGithub />
                      </a>
                    )}
                    {student.socials.linkedin && (
                      <a href={student.socials.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
                        <FaLinkedin />
                      </a>
                    )}
                    {student.socials.instagram && (
                      <a href={student.socials.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
                        <FaInstagram />
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-primary"
                  onClick={() => startEdit(student)}
                  style={{ padding: '8px 12px', fontSize: '12px' }}
                >
                  <FaEdit style={{ marginRight: '5px' }} />
                  Edit
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => openFeeForm(student)}
                  style={{ padding: '8px 12px', fontSize: '12px' }}
                >
                  <FaMoneyBill style={{ marginRight: '5px' }} />
                  Fees
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => handleDelete(student._id)}
                  style={{ padding: '8px 12px', fontSize: '12px', background: 'var(--danger)' }}
                >
                  <FaTrash style={{ marginRight: '5px' }} />
                  Delete
                </button>
              </div>
            </div>

            {/* Assigned Courses */}
            <div>
              <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaBook className="gradient-text" />
                Assigned Courses ({student.assignedCourses?.length || 0})
              </h4>
              {student.assignedCourses && student.assignedCourses.length > 0 ? (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {student.assignedCourses.map((ac) => (
                    <div key={ac.course?._id} style={{
                      padding: '12px',
                      background: 'var(--secondary-bg)',
                      borderRadius: '8px',
                      borderLeft: '4px solid var(--accent-1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{ac.course?.title}</strong>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            Started: {new Date(ac.startDate).toLocaleDateString()} | Duration: {ac.course?.duration}
                          </div>
                          <div style={{ fontSize: '12px', marginTop: '5px' }}>
                            <span style={{ color: '#10b981' }}>Paid: ₹{ac.fees?.paid || 0}</span> | 
                            <span style={{ color: '#f59e0b' }}> Remaining: ₹{ac.fees?.remaining || 0}</span> | 
                            <span> Total: ₹{ac.fees?.total || 0}</span>
                          </div>
                        </div>
                        <button 
                          className="btn-secondary"
                          onClick={() => handleRemoveCourse(student._id, ac.course?._id)}
                          style={{ padding: '5px 10px', fontSize: '11px' }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '10px' }}>
                  No courses assigned
                </p>
              )}
            </div>

            {/* Add Course Section */}
            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  className="form-input"
                  style={{ flex: 1 }}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddCourse(student._id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Assign New Course</option>
                  {courses
                    .filter(course => !student.assignedCourses?.some(ac => ac.course?._id === course._id))
                    .map(course => (
                      <option key={course._id} value={course._id}>
                        {course.title} (₹{course.price}, {course.duration})
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentManagement;