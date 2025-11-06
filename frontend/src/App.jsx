import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import CourseDetails from './components/student/CourseDetails';
import AssignmentSubmit from './components/student/AssignmentSubmit';
import Profile from './components/student/Profile';
import StudentManagement from './components/admin/StudentManagement';
import CourseManagement from './components/admin/CourseManagement';
import AssignmentManagement from './components/admin/AssignmentManagement';
import DashboardStats from './components/admin/DashboardStats';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardStats />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="assignments" element={<AssignmentManagement />} />
            </Route>
            <Route path="/student" element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="courses" replace />} />
              <Route path="courses" element={<CourseDetails />} />
              <Route path="assignments" element={<AssignmentSubmit />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;