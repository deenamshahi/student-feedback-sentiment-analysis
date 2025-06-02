import React, { useState } from 'react';
import '../CSS/TeacherManagement.css';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

const TeacherManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [teachers, setTeachers] = useState([
    {
      name: 'Prof. Robert Smith',
      department: 'Computer Science',
      course: 'CS-201',
      email: 'robert.smith@university.edu',
      subjects: 'Machine Learning, Data Science'
    },
    {
      name: 'Dr. Maria Johnson',
      department: 'Mathematics',
      course: 'MATH-105',
      email: 'maria.johnson@university.edu',
      subjects: 'Calculus, Linear Algebra'
    }
  ]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });

  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTeacher = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.department) return;

    const newTeacher = {
      name: `${form.firstName} ${form.lastName}`,
      department: form.department,
      course: 'TBD',
      email: form.email,
      subjects: 'TBD'
    };

    setTeachers([...teachers, newTeacher]);
    setForm({ firstName: '', lastName: '', email: '', department: '' });

    // Show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className={`teacher-page ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <div className="main-content">

        {showToast && (
          <div className="toast-success">
            ✅ Teacher added successfully!
          </div>
        )}

        <div className="section-box red">
          <h2>Teacher Management</h2>
          <p>
            Add new teachers and instructors to the system. Teachers can be assigned to
            courses and receive student feedback for continuous improvement.
          </p>
        </div>

        <div className="section-box pink">
          <h2>Add New Teacher</h2>
          <div className="form-grid">
            <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
            <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
            <input name="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
            <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
          </div>
          <button className="add-btn" onClick={handleAddTeacher}>Add Teacher</button>
        </div>

        <div className="section-box red">
          <h2>Current Faculty</h2>
          {teachers.map((t, idx) => (
            <div key={idx} className="teacher-card">
              <strong>{t.name}</strong>
              <p>{t.department} • {t.course}</p>
              <p>{t.email}</p>
              <p>{t.subjects}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherManagement;
