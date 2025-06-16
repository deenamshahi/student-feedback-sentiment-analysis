// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const [overviewOpen, setOverviewOpen] = useState(false);

  const handleSentimentClick = () => navigate('/admin-dashboard');
  const handleAddStudentClick = () => navigate('/add-student');
  const handleAddTeacherClick = () => navigate('/teacher-management');
  const handleAddQuestionClick = () => navigate('/create-form');
  const toggleOverview = () => setOverviewOpen((prev) => !prev);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul>
        <li onClick={handleSentimentClick} className="menu-item">Sentiment Analytics</li>

        <li onClick={toggleOverview} className="menu-item dropdown-toggle">
          Overview
          <span className={`arrow ${overviewOpen ? 'open' : ''}`}>▸</span>
        </li>

        {overviewOpen && (
          <ul className="sub-menu">
            <li onClick={handleAddStudentClick} className="submenu-item">Add students</li>
            <li onClick={handleAddTeacherClick} className="submenu-item">Add teacher</li>
          </ul>
        )}

        <li onClick={handleAddQuestionClick} className="menu-item">Add Question</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
