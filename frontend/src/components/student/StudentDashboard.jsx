import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';

const StudentDashboard = () => {
  return (
    <div style={{ background: 'var(--primary-bg)', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentDashboard;