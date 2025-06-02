import React, { useState } from 'react';
import '../CSS/AddStudent.css';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

const AddStudentPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [students, setStudents] = useState([
    {
      name: 'John Doe',
      id: 'S2024001',
      department: 'Computer Science',
      year: 'Junior',
      email: 'john.doe@university.edu'
    },
    {
      name: 'Sarah Johnson',
      id: 'S2024002',
      department: 'Mathematics',
      year: 'Sophomore',
      email: 'sarah.johnson@university.edu'
    }
  ]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    department: '',
    year: ''
  });

  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, studentId, department, year } = form;

    if (!firstName || !lastName || !email || !studentId || !department || !year) return;

    const newStudent = {
      name: `${firstName} ${lastName}`,
      id: studentId,
      department,
      year,
      email
    };

    setStudents([...students, newStudent]);

    setForm({
      firstName: '',
      lastName: '',
      email: '',
      studentId: '',
      department: '',
      year: ''
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className={`add-student-page ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <main className="main-content">
        
        {showToast && (
          <div className="toast-success">✅ Student added successfully!</div>
        )}

        <header className="page-header">
          <h2>Student Management</h2>
          <p>
            Add new students to the system and manage existing student records. Students can
            submit anonymous feedback for courses and instructors.
          </p>
        </header>

        <section className="form-section">
          <h3>Add New Student</h3>
          <form className="student-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="studentId"
                placeholder="Student ID"
                value={form.studentId}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={form.department}
                onChange={handleChange}
              />
              <input
                type="text"
                name="year"
                placeholder="Academic Year"
                value={form.year}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="add-btn">Add Student</button>
          </form>
        </section>

        <section className="students-list">
          <h3>Students</h3>
          {students.map((s, idx) => (
            <div key={idx} className="student-card">
              <strong>{s.name}</strong><br />
              {s.id} • {s.department} • {s.year}<br />
              {s.email}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default AddStudentPage;
