import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { FaPlus, FaMoneyBill, FaUserGraduate, FaBook } from 'react-icons/fa';

const FeeManagement = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    amount: '',
    paymentMethod: 'Online',
    transactionId: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/all');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
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
      await api.post('/payments', {
        ...formData,
        amount: Number(formData.amount)
      });
      setShowForm(false);
      setFormData({ studentId: '', courseId: '', amount: '', paymentMethod: 'Online', transactionId: '' });
      fetchPayments();
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Fee Management</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          <FaPlus style={{ marginRight: '8px' }} />
          Record Payment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <FaMoneyBill size={32} className="gradient-text" style={{ marginBottom: '10px' }} />
          <h3 className="gradient-text">Total Revenue</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>₹{totalRevenue}</p>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <FaUserGraduate size={32} className="gradient-text" style={{ marginBottom: '10px' }} />
          <h3 className="gradient-text">Total Students</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>{students.length}</p>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <FaBook size={32} className="gradient-text" style={{ marginBottom: '10px' }} />
          <h3 className="gradient-text">Total Courses</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>{courses.length}</p>
        </div>
      </div>

      {showForm && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Record Payment</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Student</label>
                <select
                  name="studentId"
                  className="form-input"
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.studentId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Course</label>
                <select
                  name="courseId"
                  className="form-input"
                  value={formData.courseId}
                  onChange={(e) => setFormData({...formData, courseId: e.target.value})}
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
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  className="form-input"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  name="paymentMethod"
                  className="form-input"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                >
                  <option value="Online">Online</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Transaction ID</label>
                <input
                  type="text"
                  name="transactionId"
                  className="form-input"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary">
                Record Payment
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Method</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>
                  <div>
                    <strong>{payment.studentId?.name}</strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {payment.studentId?.studentId}
                    </div>
                  </div>
                </td>
                <td>{payment.courseId?.title}</td>
                <td style={{ fontWeight: 'bold', color: 'var(--success)' }}>₹{payment.amount}</td>
                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td>{payment.paymentMethod}</td>
                <td>{payment.transactionId || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeManagement;