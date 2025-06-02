import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateForm from './Components/CreateForm';
import AddStudentPage from './pages/AddStudentPage';
import TeacherManagement from './pages/TeacherManagement';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/create-form" element={<CreateForm />} />
        <Route path="/add-student" element={<AddStudentPage />} />
        <Route path="/teacher-management" element={<TeacherManagement />} />
      </Routes>
    </Router>
  );
};

export default App;
