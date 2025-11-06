import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { 
  FaUsers, 
  FaBook, 
  FaTasks, 
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner" style={{ margin: '50px auto' }}></div>;
  }

  if (!stats) {
    return <div>Error loading dashboard stats</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Admin Dashboard</h1>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <FaUsers size={32} className="gradient-text" style={{ marginBottom: '10px' }} />
          <h3 className="gradient-text">Total Students</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
            {stats.counts.totalStudents}
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <FaBook size={32} className="gradient-text" style={{ marginBottom: '10px' }} />
          <h3 className="gradient-text">Total Courses</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
            {stats.counts.totalCourses}
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <FaTasks size={32} className="gradient-text" style={{ marginBottom: '10px' }} />
          <h3 className="gradient-text">Total Assignments</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
            {stats.counts.totalAssignments}
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <FaClock size={32} className="gradient-text" style={{ marginBottom: '10px' }} />
          <h3 className="gradient-text">Pending Submissions</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>
            {stats.counts.pendingSubmissions}
          </p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaCheckCircle className="gradient-text" />
          Recent Submissions
        </h4>
        {stats.recentActivities.submissions.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {stats.recentActivities.submissions.map((submission) => (
              <div key={submission._id} style={{
                padding: '12px',
                background: 'var(--secondary-bg)',
                borderRadius: '8px',
                borderLeft: `4px solid ${
                  submission.status === 'Pending' ? '#f59e0b' : 
                  submission.status === 'Approved' ? '#10b981' : '#ef4444'
                }`
              }}>
                <div>
                  <strong>{submission.student?.name}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {submission.assignment?.title}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: submission.status === 'Pending' ? '#f59e0b' : 
                          submission.status === 'Approved' ? '#10b981' : '#ef4444',
                    fontWeight: 'bold',
                    marginTop: '5px'
                  }}>
                    {submission.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
            No recent submissions
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardStats;