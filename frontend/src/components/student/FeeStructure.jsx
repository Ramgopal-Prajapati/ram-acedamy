import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { FaMoneyBill, FaCheckCircle, FaClock, FaBook } from 'react-icons/fa';

const FeeStructure = () => {
  const { user } = useAuth();
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      const response = await api.get('/payments/student');
      setPaymentSummary(response.data.summary);
      setPayments(response.data.payments);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  if (!paymentSummary) {
    return <div className="loading-spinner" style={{ margin: '50px auto' }}></div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Fee Structure</h1>

      {/* Overall Summary */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaMoneyBill className="gradient-text" />
          Overall Fee Summary
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
              Total Fees
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              ₹{paymentSummary.totalFees}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
              Total Paid
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
              ₹{paymentSummary.totalPaid}
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'var(--secondary-bg)', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
              Remaining
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
              ₹{paymentSummary.remainingFees}
            </div>
          </div>
        </div>
      </div>

      {/* Course-wise Breakdown */}
      <div className="glass-card" style={{ padding: '25px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaBook className="gradient-text" />
          Course-wise Fee Breakdown
        </h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {user.assignedCourses && user.assignedCourses.map((ac) => (
            <div key={ac.course._id} style={{
              padding: '20px',
              background: 'var(--secondary-bg)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--accent-1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ marginBottom: '5px' }}>{ac.course.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '10px' }}>
                    {ac.course.description}
                  </p>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <span>Duration: {ac.course.duration}</span>
                    <span>Start Date: {new Date(ac.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    ₹{ac.fees.total}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Total Course Fees
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <FaCheckCircle style={{ color: '#10b981', marginBottom: '8px' }} />
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Paid Amount</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>₹{ac.fees.paid}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                  <FaClock style={{ color: '#f59e0b', marginBottom: '8px' }} />
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Remaining</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>₹{ac.fees.remaining}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
                  <FaMoneyBill style={{ color: 'var(--accent-1)', marginBottom: '8px' }} />
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Payment Progress</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {((ac.fees.paid / ac.fees.total) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '15px' }}>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: 'var(--border-color)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(ac.fees.paid / ac.fees.total) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="glass-card" style={{ padding: '25px' }}>
        <h3 style={{ marginBottom: '20px' }}>Payment History</h3>
        {payments.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {payments.map((payment) => (
              <div key={payment._id} style={{
                padding: '15px',
                background: 'var(--secondary-bg)',
                borderRadius: '8px',
                borderLeft: '4px solid #10b981'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{payment.courseId?.title}</strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod}
                      {payment.transactionId && ` • Transaction: ${payment.transactionId}`}
                    </div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                    ₹{payment.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
            No payment history available
          </p>
        )}
      </div>
    </div>
  );
};

export default FeeStructure;