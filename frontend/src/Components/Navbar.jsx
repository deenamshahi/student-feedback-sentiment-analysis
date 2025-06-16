import React from 'react';
import '../CSS/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole"); // moved outside function for reuse

  const handleBackHome = () => {
    if (role === "admin") {
      navigate('/admin-dashboard');
    } else if (role === "student") {
      navigate('/student-dashboard');
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("userRole"); // ✅ Clear role
  alert("Logged out successfully");
  navigate('/');
};

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="left">
          {/* Show hamburger only if user is admin */}
          {role === "admin" && (
            <button className="hamburger" onClick={toggleSidebar}>☰</button>
          )}
          <h1 onClick={handleBackHome} style={{ color: '#00CED1' }}>SFA</h1>
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
