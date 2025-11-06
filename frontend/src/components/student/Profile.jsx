import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaIdCard, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaInstagram, FaBook } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="loading-spinner" style={{ margin: '50px auto' }}></div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>My Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
        {/* Profile Card */}
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: 'white'
          }}>
            <FaUser />
          </div>
          
          <h2 style={{ marginBottom: '10px' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{user.email}</p>
          
          <div style={{ 
            background: 'var(--secondary-bg)', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <FaIdCard className="gradient-text" />
              <span style={{ fontWeight: '600' }}>{user.studentId}</span>
            </div>
          </div>

          {/* Social Links */}
          {(user.socials?.github || user.socials?.linkedin || user.socials?.instagram) && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
              {user.socials.github && (
                <a 
                  href={user.socials.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: 'var(--text-secondary)',
                    fontSize: '20px',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = 'var(--accent-1)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  <FaGithub />
                </a>
              )}
              {user.socials.linkedin && (
                <a 
                  href={user.socials.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: 'var(--text-secondary)',
                    fontSize: '20px',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = 'var(--accent-1)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  <FaLinkedin />
                </a>
              )}
              {user.socials.instagram && (
                <a 
                  href={user.socials.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: 'var(--text-secondary)',
                    fontSize: '20px',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = 'var(--accent-1)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  <FaInstagram />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Personal Information */}
        <div>
          <div className="glass-card" style={{ padding: '25px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '20px' }}>Personal Information</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaEnvelope style={{ color: 'var(--accent-1)' }} />
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Email</div>
                  <div>{user.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaIdCard style={{ color: 'var(--accent-1)' }} />
                <div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Student ID</div>
                  <div>{user.studentId}</div>
                </div>
              </div>
              {user.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaPhone style={{ color: 'var(--accent-1)' }} />
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Phone</div>
                    <div>{user.phone}</div>
                  </div>
                </div>
              )}
              {user.address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaMapMarkerAlt style={{ color: 'var(--accent-1)' }} />
                  <div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Address</div>
                    <div>{user.address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Courses Summary */}
          <div className="glass-card" style={{ padding: '25px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaBook className="gradient-text" />
              Assigned Courses ({user.assignedCourses?.length || 0})
            </h3>
            {user.assignedCourses && user.assignedCourses.length > 0 ? (
              <div style={{ display: 'grid', gap: '15px' }}>
                {user.assignedCourses.map((ac) => (
                  <div key={ac.course?._id} style={{
                    padding: '15px',
                    background: 'var(--secondary-bg)',
                    borderRadius: '8px',
                    borderLeft: '4px solid var(--accent-1)'
                  }}>
                    <h4 style={{ marginBottom: '5px' }}>{ac.course?.title}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                      {ac.course?.description}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <span>Duration: {ac.course?.duration}</span>
                      <span>Start Date: {new Date(ac.startDate).toLocaleDateString()}</span>
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '14px' }}>
                      <span style={{ color: '#10b981' }}>Paid: ₹{ac.fees?.paid || 0}</span> • 
                      <span style={{ color: '#f59e0b' }}> Remaining: ₹{ac.fees?.remaining || 0}</span> • 
                      <span> Total: ₹{ac.fees?.total || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                No courses assigned yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;