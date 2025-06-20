import React, { useState } from 'react';
import '../CSS/AddStudent.css';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

const AddStudentPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [students, setStudents] = useState([
    {
      name: 'Anisha Sharma',
      id: 'S2024003',
      faculty: 'Computer Science',
      year: 'Second',
      email: 'anisha.sharma@student.edu',
      password: 'anisha123'
    },
    {
      name: 'Rahul Thapa',
      id: 'S2024004',
      faculty: 'Engineering',
      year: 'First',
      email: 'rahul.thapa@student.edu',
      password: 'rahul456'
    },
    {
      name: 'Sneha Karki',
      id: 'S2024005',
      faculty: 'Mathematics',
      year: 'Third',
      email: 'sneha.karki@student.edu',
      password: 'sneha789'
    }
  ]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    faculty: '',
    year: '',
    password: ''
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    faculty: '',
    year: '',
    password: ''
  });

  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: '' }), 3000);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, studentId, faculty, year, password } = form;
    if (!firstName || !lastName || !email || !studentId || !faculty || !year || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    const newStudent = {
      name: `${firstName} ${lastName}`,
      id: studentId,
      faculty,
      year,
      email,
      password
    };

    setStudents([...students, newStudent]);
    setForm({ firstName: '', lastName: '', email: '', studentId: '', faculty: '', year: '', password: '' });
    showToast('Student added successfully!', 'success');
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;
    const newStudents = students.filter((_, i) => i !== index);
    setStudents(newStudents);
    showToast('Student deleted.', 'success');
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
      faculty: s.faculty,
      year: s.year,
      password: s.password
    });
    setEditingIndex(index);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, studentId, faculty, year, password } = editForm;
    if (!firstName || !lastName || !email || !studentId || !faculty || !year || !password) return;

    const updatedStudent = {
      name: `${firstName} ${lastName}`,
      id: studentId,
      faculty,
      year,
      email,
      password
    };

    const updatedStudents = [...students];
    updatedStudents[editingIndex] = updatedStudent;
    setStudents(updatedStudents);
    setEditingIndex(null);
    showToast('Student updated.', 'success');
  };

  const filteredAndSortedStudents = students
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.includes(searchTerm))
    .sort((a, b) => {
      if (!sortKey) return 0;
      return a[sortKey].localeCompare(b[sortKey]);
    });

  return (
    <div className={`add-student-page ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <main className="main-content">

        {toast.visible && <div className={`toast-${toast.type}`}>{toast.message}</div>}

        <header className="page-header">
          <h2>Student Management</h2>
          <p>Manage student records including adding, editing, and deleting student details.</p>
        </header>

        <section className="form-section">
          <h3>Add New Student</h3>
          <form className="student-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
              <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
            </div>
            <div className="form-row">
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
            </div>
            <div className="form-row">
              <input type="text" name="studentId" placeholder="Student ID" value={form.studentId} onChange={handleChange} />
              <input type="text" name="year" placeholder="Academic Year" value={form.year} onChange={handleChange} />
            </div>
            <div className="form-row">
              <select name="faculty" value={form.faculty} onChange={handleChange}>
                <option value="">Select Faculty / Programme</option>
                <option value="Data Structures and Algorithms">Data Structures and Algorithms</option>
                <option value="Engineering Mathematics">Engineering Mathematics</option>
                <option value="Object-Oriented Programming">Object-Oriented Programming</option>
              </select>
            </div>
            <button className="add-btn" type="submit">Add Student</button>
          </form>
        </section>

        <section className="students-list">
          <h3>Students</h3>

          <div className="controls">
            <input
              type="text"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select onChange={(e) => setSortKey(e.target.value)} defaultValue="">
              <option value="">Sort by</option>
              <option value="name">Name</option>
              <option value="year">Year</option>
            </select>
          </div>

          {filteredAndSortedStudents.map((s, idx) => (
            <div key={idx} className="student-card">
              {editingIndex === idx ? (
                <form onSubmit={saveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input type="text" name="firstName" placeholder="First Name" value={editForm.firstName} onChange={handleEditChange} />
                  <input type="text" name="lastName" placeholder="Last Name" value={editForm.lastName} onChange={handleEditChange} />
                  <input type="email" name="email" placeholder="Email" value={editForm.email} onChange={handleEditChange} />
                  <input type="text" name="studentId" placeholder="Student ID" value={editForm.studentId} onChange={handleEditChange} />
                  <input type="text" name="faculty" placeholder="Faculty" value={editForm.faculty} onChange={handleEditChange} />
                  <input type="text" name="year" placeholder="Year" value={editForm.year} onChange={handleEditChange} />
                  <input type="password" name="password" placeholder="Password" value={editForm.password} onChange={handleEditChange} />
                  <div>
                    <button type="submit" style={{ marginRight: '8px' }}>Save</button>
                    <button type="button" onClick={cancelEditing}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <strong>{s.name}</strong><br />
                  {s.id} • {s.faculty} • {s.year}<br />
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
