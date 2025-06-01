import React from 'react';
import '../CSS/AddStudent.css';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import { useState } from 'react';

const AddStudentPage = () => {
const [sidebarOpen, setSidebarOpen] = useState(false);
const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  return (
    <div className={`add-student-page ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <main className="main-content">
        <header className="page-header">
          <h2>Student Management</h2>
          <p>
            Add new students to the system and manage existing student records. Students can
            submit anonymous feedback for courses and instructors.
          </p>
        </header>

        <section className="form-section">
          <h3>Add New Student</h3>
          <form className="student-form">
            <div className="form-row">
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="Last Name" />
            </div>
            <div className="form-row">
              <input type="email" placeholder="Email Address" />
              <input type="text" placeholder="Student ID" />
            </div>
            <div className="form-row">
              <input type="text" placeholder="Department" />
              <input type="text" placeholder="Academic Year" />
            </div>
            <button type="submit" className="add-btn">Add Student</button>
          </form>
        </section>

        <section className="students-list">
          <h3>Students</h3>
          <div className="student-card">
            <strong>John Doe</strong><br />
            S2024001 • Computer Science • Junior<br />
            john.doe@university.edu
          </div>
          <div className="student-card">
            <strong>Sarah Johnson</strong><br />
            S2024002 • Mathematics • Sophomore<br />
            sarah.johnson@university.edu
          </div>
        </section>
      </main>
      </div>
  );
};

export default AddStudentPage;
