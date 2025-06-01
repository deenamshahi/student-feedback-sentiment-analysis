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
  return (
     <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul>
        <li>Teachers</li>
        <li onClick={handleAddStudentClick}>Students</li>
        <li>Analytics</li>
        <li onClick={handleFormClick}>Create Form</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
