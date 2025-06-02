import React from 'react';
import '../CSS/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const handleBackHome = () => {
    navigate('/admin-dashboard'); // Navigate to the home page or login page
  };
  const handleLogout = () => {
    // Logic to handle logout, e.g., clearing tokens, redirecting to login
    navigate('/');
  };
  return (
  <nav className="navbar">
  <div className="navbar-inner">
    <div className="left">
      <button className="hamburger" onClick={toggleSidebar}>☰</button>
      <h1 onClick={handleBackHome}>SFA</h1>
    </div>
    <div className="center">
      <input type="text" className="search-box" placeholder="Search..." />
    </div>
    <div className="right">
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  </div>
</nav>

  );
};

export default Navbar;
