import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaSignOutAlt, FaGraduationCap, FaBook, FaTasks } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'var(--secondary-bg)',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to={user?.role === 'admin' ? '/admin' : '/student'} 
                style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaGraduationCap size={24} className="gradient-text" />
              <h1 className="gradient-text" style={{ margin: 0, fontSize: '24px' }}>
                RamC Academy
              </h1>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user?.role === 'student' && (
              <>
                <Link 
                  to="/student/courses" 
                  className={`btn-secondary ${location.pathname === '/student/courses' ? 'active' : ''}`}
                  style={{ 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 16px',
                    fontSize: '14px'
                  }}
                >
                  <FaBook />
                  Courses
                </Link>
                <Link 
                  to="/student/assignments" 
                  className={`btn-secondary ${location.pathname === '/student/assignments' ? 'active' : ''}`}
                  style={{ 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 16px',
                    fontSize: '14px'
                  }}
                >
                  <FaTasks />
                  Assignments
                </Link>
                <Link 
                  to="/student/profile" 
                  className={`btn-secondary ${location.pathname === '/student/profile' ? 'active' : ''}`}
                  style={{ 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 16px',
                    fontSize: '14px'
                  }}
                >
                  <FaUser />
                  Profile
                </Link>
              </>
            )}
            
            <button 
              onClick={handleLogout}
              className="btn-secondary"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;