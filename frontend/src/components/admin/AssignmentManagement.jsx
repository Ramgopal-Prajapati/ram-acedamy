import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    assignedStudents: [],
    dueDate: ''
  });

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
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

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assignments', {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      });
      setShowForm(false);
      resetForm();
      fetchAssignments();
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error creating assignment: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/assignments/${editingAssignment._id}`, {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString()
      });
      setEditingAssignment(null);
      resetForm();
      fetchAssignments();
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Error updating assignment: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await api.delete(`/assignments/${assignmentId}`);
        fetchAssignments();
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Error deleting assignment: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleStatusUpdate = async (submissionId, status) => {
    try {
      await api.put(`/submissions/${submissionId}/status`, { status });
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status: ' + (error.response?.data?.message || error.message));
    }
  };

  const startEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      course: assignment.course._id,
      assignedStudents: assignment.assignedStudents.map(s => s._id),
      dueDate: assignment.dueDate.split('T')[0]
    });
  };

  const cancelEdit = () => {
    setEditingAssignment(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      course: '',
      assignedStudents: [],
      dueDate: ''
    });
  };

  const handleStudentSelection = (studentId) => {
    const currentStudents = [...formData.assignedStudents];
    if (currentStudents.includes(studentId)) {
      setFormData({
        ...formData,
        assignedStudents: currentStudents.filter(id => id !== studentId)
      });
    } else {
      setFormData({
        ...formData,
        assignedStudents: [...currentStudents, studentId]
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      'Pending': 'status-pending',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected'
    }[status] || 'status-pending';

    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Assignment Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          <FaPlus style={{ marginRight: '8px' }} />
          Add Assignment
        </button>
      </div>

      {/* Add/Edit Assignment Form */}
      {(showForm || editingAssignment) && (
        <div className="glass-card" style={{ padding: '25px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>
            {editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
          </h3>
          <form onSubmit={editingAssignment ? handleUpdate : handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Assignment Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Course *</label>
                <select
                  className="form-input"
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-input"
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assign to Students (Leave empty for all students in course)</label>
              <div style={{ 
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '15px',
                background: 'var(--secondary-bg)',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {students.map(student => (
                  <div key={student._id} style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.assignedStudents.includes(student._id)}
                        onChange={() => handleStudentSelection(student._id)}
                      />
                      <div>
                        <div style={{ fontWeight: '500' }}>{student.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {student.studentId} • {student.email}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>
                {formData.assignedStudents.length} student(s) selected
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary">
                {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  if (editingAssignment) {
                    cancelEdit();
                  } else {
                    setShowForm(false);
                  }
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px' }}>Assignments</h2>
        <div style={{ display: 'grid', gap: '20px' }}>
          {assignments.map((assignment) => (
            <div key={assignment._id} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '10px' }}>{assignment.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                    {assignment.description}
                  </p>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <strong>Course:</strong> {assignment.course?.title}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <strong>Assigned to:</strong> {assignment.assignedStudents.length > 0 ? 
                        `${assignment.assignedStudents.length} students` : 'All students in course'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn-primary"
                    onClick={() => startEdit(assignment)}
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                  >
                    <FaEdit style={{ marginRight: '5px' }} />
                    Edit
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => handleDelete(assignment._id)}
                    style={{ padding: '8px 12px', fontSize: '12px', background: 'var(--danger)' }}
                  >
                    <FaTrash style={{ marginRight: '5px' }} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div>
        <h2 style={{ marginBottom: '20px' }}>Assignment Submissions</h2>
        <div className="glass-card">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Assignment</th>
                <th>GitHub URL</th>
                <th>Submitted At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id}>
                  <td>
                    <div>
                      <strong>{submission.student?.name}</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {submission.student?.studentId}
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>{submission.assignment?.title}</strong>
                  </td>
                  <td>
                    <a 
                      href={submission.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-1)' }}
                    >
                      View Code <FaExternalLinkAlt size={12} />
                    </a>
                  </td>
                  <td>
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </td>
                  <td>
                    {getStatusBadge(submission.status)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className="btn-primary"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                        onClick={() => handleStatusUpdate(submission._id, 'Approved')}
                        disabled={submission.status === 'Approved'}
                      >
                        <FaCheck style={{ marginRight: '5px' }} />
                        Approve
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                        onClick={() => handleStatusUpdate(submission._id, 'Rejected')}
                        disabled={submission.status === 'Rejected'}
                      >
                        <FaTimes style={{ marginRight: '5px' }} />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {submissions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No assignment submissions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentManagement;