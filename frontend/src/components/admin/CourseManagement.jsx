import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { FaPlus, FaEdit, FaTrash, FaBook, FaClock, FaMoneyBill } from 'react-icons/fa';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    price: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

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
    try {
      await api.post('/courses', {
        ...formData,
        price: Number(formData.price)
      });
      setShowForm(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/courses/${editingCourse._id}`, {
        ...formData,
        price: Number(formData.price)
      });
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Error updating course: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${courseId}`);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const startEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      price: course.price
    });
  };

  const cancelEdit = () => {
    setEditingCourse(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      price: ''
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Course Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          <FaPlus style={{ marginRight: '8px' }} />
          Add Course
        </button>
      </div>

      {/* Add/Edit Course Form */}
      {(showForm || editingCourse) && (
        <div className="glass-card" style={{ padding: '25px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h3>
          <form onSubmit={editingCourse ? handleUpdate : handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Course Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duration *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="e.g., 12 weeks"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  min="0"
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

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary">
                {editingCourse ? 'Update Course' : 'Create Course'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  if (editingCourse) {
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

      {/* Courses List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {courses.map((course) => (
          <div key={course._id} className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '10px' }}>{course.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                  {course.description}
                </p>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaClock className="gradient-text" />
                    <span>{course.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaMoneyBill className="gradient-text" />
                    <span>₹{course.price}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaBook className="gradient-text" />
                    <span>Instructor: {course.instructor}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-primary"
                  onClick={() => startEdit(course)}
                  style={{ padding: '8px 12px', fontSize: '12px' }}
                >
                  <FaEdit style={{ marginRight: '5px' }} />
                  Edit
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => handleDelete(course._id)}
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
  );
};

export default CourseManagement;