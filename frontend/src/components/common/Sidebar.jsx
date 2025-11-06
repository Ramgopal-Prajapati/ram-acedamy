import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaUsers, 
  FaBook, 
  FaTasks, 
  FaChartBar,
  FaExternalLinkAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: FaChartBar, label: 'Dashboard' },
    { path: '/admin/students', icon: FaUsers, label: 'Students' },
    { path: '/admin/courses', icon: FaBook, label: 'Courses' },
    { path: '/admin/assignments', icon: FaTasks, label: 'Assignments' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside style={{
      width: '250px',
      background: 'var(--secondary-bg)',
      borderRight: '1px solid var(--border-color)',
      height: 'calc(100vh - 80px)',
      position: 'fixed',
      top: '80px',
      left: 0,
      padding: '20px 0'
    }}>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              color: isActive(item.path) ? 'var(--accent-1)' : 'var(--text-secondary)',
              textDecoration: 'none',
              borderLeft: isActive(item.path) ? '4px solid var(--accent-1)' : '4px solid transparent',
              background: isActive(item.path) ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <item.icon style={{ marginRight: '12px' }} />
            {item.label}
          </Link>
        ))}
        
        <a
          href="https://ramc.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            borderLeft: '4px solid transparent',
            transition: 'all 0.3s ease',
            marginTop: '20px'
          }}
          className="external-link"
        >
          <FaBook style={{ marginRight: '12px' }} />
          More Courses
          <FaExternalLinkAlt style={{ marginLeft: 'auto', fontSize: '12px' }} />
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;