import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';

const AdminDashboard = () => {
  return (
    <div style={{ background: 'var(--primary-bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ 
          marginLeft: '250px', 
          padding: '20px',
          width: 'calc(100% - 250px)',
          minHeight: 'calc(100vh - 80px)'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;