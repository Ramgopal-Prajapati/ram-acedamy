import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaClock, FaMoneyBill, FaCalendar, FaCheckCircle } from 'react-icons/fa';

const CourseDetails = () => {
  const { user } = useAuth();

  if (!user || !user.assignedCourses) {
    return <div className="loading-spinner" style={{ margin: '50px auto' }}></div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>My Courses</h1>

      <div style={{ display: 'grid', gap: '20px' }}>
        {user.assignedCourses.length > 0 ? (
          user.assignedCourses.map((ac) => (
            <div key={ac.course?._id} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '10px' }}>{ac.course?.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
                    {ac.course?.description}
                  </p>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaClock className="gradient-text" />
                      <span>{ac.course?.duration}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaMoneyBill className="gradient-text" />
                      <span>Total: ₹{ac.fees?.total}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaBook className="gradient-text" />
                      <span>Instructor: {ac.course?.instructor}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaCalendar className="gradient-text" />
                      <span>Started: {new Date(ac.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Progress */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Payment Progress</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    ₹{ac.fees?.paid} / ₹{ac.fees?.total} ({((ac.fees?.paid / ac.fees?.total) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: 'var(--border-color)', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(ac.fees?.paid / ac.fees?.total) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#10b981' }}>
                    <FaCheckCircle style={{ marginRight: '5px' }} />
                    Paid: ₹{ac.fees?.paid}
                  </span>
                  <span style={{ fontSize: '12px', color: '#f59e0b' }}>
                    Remaining: ₹{ac.fees?.remaining}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <FaBook size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
            <h3 style={{ marginBottom: '10px' }}>No Courses Assigned</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              You haven't been assigned any courses yet. Please contact the administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;