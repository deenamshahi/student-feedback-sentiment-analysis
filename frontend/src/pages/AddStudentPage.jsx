import React, { useState } from 'react';
import '../CSS/AddStudent.css';  // Make sure your CSS file is correctly named and path is right
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

  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({
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

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
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

  const handleDelete = (index) => {
    const newStudents = students.filter((_, i) => i !== index);
    setStudents(newStudents);
  };

  const startEditing = (index) => {
    const s = students[index];
    const [firstName, ...lastNameParts] = s.name.split(' ');
    const lastName = lastNameParts.join(' ');
    setEditForm({
      firstName,
      lastName,
      email: s.email,
      studentId: s.id,
      department: s.department,
      year: s.year
    });
    setEditingIndex(index);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, studentId, department, year } = editForm;
    if (!firstName || !lastName || !email || !studentId || !department || !year) return;

    const updatedStudent = {
      name: `${firstName} ${lastName}`,
      id: studentId,
      department,
      year,
      email
    };

    const updatedStudents = [...students];
    updatedStudents[editingIndex] = updatedStudent;
    setStudents(updatedStudents);
    setEditingIndex(null);
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
            <button className="add-btn" type="submit">Add Student</button>
          </form>
        </section>

        <section className="students-list">
          <h3>Students</h3>
          {students.map((s, idx) => (
            <div key={idx} className="student-card">
              {editingIndex === idx ? (
                <form onSubmit={saveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={editForm.firstName}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={editForm.lastName}
                    onChange={handleEditChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={editForm.email}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="studentId"
                    placeholder="Student ID"
                    value={editForm.studentId}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={editForm.department}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="year"
                    placeholder="Academic Year"
                    value={editForm.year}
                    onChange={handleEditChange}
                  />
                  <div>
                    <button type="submit" style={{ marginRight: '8px' }}>Save</button>
                    <button type="button" onClick={cancelEditing}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <strong>{s.name}</strong><br />
                  {s.id} • {s.department} • {s.year}<br />
                  {s.email}<br />
                  <button className="edit-btn" onClick={() => startEditing(idx)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(idx)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default AddStudentPage;
