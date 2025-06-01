import React from 'react';
import { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import '../CSS/AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`dashboard-container ${sidebarOpen ? 'sidebar-active' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <main className="dashboard-content">
        <section className="stats">
          <div className="card total">247<br />Total Feedback</div>
          <div className="card positive">156<br />Positive</div>
          <div className="card negative">45<br />Negative</div>
          <div className="card neutral">46<br />Neutral</div>
        </section>
        <section className="analytics-placeholder">
          <h2>Sentiment Trends Over Time</h2>
          <div className="chart-placeholder">[Graph Placeholder]</div>
        </section>
        <section className="feedback">
          <div className="chart-placeholder">[Pie Chart Placeholder]</div>
          <div className="recent-feedback">
            <h3>Recent Feedback</h3>
            <p><strong>CS101 - Prof. Smith</strong><br />"The professor explains clearly..."</p>
            <p><strong>ENG301 - Prof. Williams</strong><br />"Interesting but could improve..."</p>
            <p><strong>MATH201 - Prof. Johnson</strong><br />"Assignments unclear..."</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;