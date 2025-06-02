import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const handleFormClick = () => {
    navigate('/create-form');
  };
  const handleAddStudentClick = () => {
    navigate('/add-student');
  };
  const handleTeacherManagementClick = () => {
    navigate('/teacher-management');
  };
  return (
     <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul>
        <li onClick={handleTeacherManagementClick}>Teachers</li>
        <li onClick={handleAddStudentClick}>Students</li>
        <li onClick={handleFormClick}>Create Form</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
