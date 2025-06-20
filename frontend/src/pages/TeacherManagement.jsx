import React, { useState } from 'react';
import '../CSS/TeacherManagement.css';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

const TeacherManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [teachers, setTeachers] = useState([
    {
      name: 'Prof. Aayush Sharma',
      email: 'aayush.sharma@university.edu',
      course: 'Data Structures and Algorithms',
      password: '******',
      subjects: 'Data Structures and Algorithms'
    },
    {
      name: 'Dr. Pratiksha Koirala',
      email: 'pratiksha.koirala@university.edu',
      course: 'Engineering Mathematics',
      password: '******',
      subjects: 'Engineering Mathematics'
    },
    {
      name: 'Ms. Ritesh Gurung',
      email: 'ritesh.gurung@university.edu',
      course: 'Object-Oriented Programming',
      password: '******',
      subjects: 'Object-Oriented Programming'
    }
  ]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    course: ''
  });

  const [showToast, setShowToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTeacher = () => {
    const { firstName, lastName, email, password, course } = form;

    if (!firstName || !lastName || !email || !password || !course) {
      alert("Please fill in all the fields.");
      return;
    }

    const newTeacher = {
      name: `${firstName} ${lastName}`,
      course,
      email,
      password: '******',
      subjects: course
    };

    setTeachers([...teachers, newTeacher]);
    setForm({ firstName: '', lastName: '', email: '', password: '', course: '' });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm("Are you sure you want to delete this teacher?");
    if (confirmed) {
      const updatedTeachers = [...teachers];
      updatedTeachers.splice(index, 1);
      setTeachers(updatedTeachers);
      setShowDeleteToast(true);
      setTimeout(() => setShowDeleteToast(false), 3000);
    }
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

        {showDeleteToast && (
          <div className="toast-success delete-toast">
            🗑️ Teacher deleted successfully!
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
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
            <select name="course" value={form.course} onChange={handleChange}>
              <option value="">Select Course</option>
              <option value="Data Structures and Algorithms">Data Structures and Algorithms</option>
              <option value="Engineering Mathematics">Engineering Mathematics</option>
              <option value="Object-Oriented Programming">Object-Oriented Programming</option>
            </select>
          </div>
          <button className="add-btn" onClick={handleAddTeacher}>Add Teacher</button>
        </div>

        <div className="section-box red">
          <h2>Current Faculty</h2>
          {teachers.map((t, idx) => (
            <div key={idx} className="teacher-card">
              <strong>{t.name}</strong>
              <p>{t.course}</p>
              <p>{t.email}</p>
              <p>{t.subjects}</p>
              <div className="action-buttons">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(idx)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherManagement;
