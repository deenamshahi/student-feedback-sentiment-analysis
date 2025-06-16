import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';
import '../CSS/AdminDashboard.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className={`dashboard-container ${sidebarOpen ? 'sidebar-active' : ''}`}>
      <Navbar onHamburgerClick={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />

      <main className="dashboard-content">
        {/* Feedback Summary */}
        <section className="feedback-summary">
          <div className="feedback-box total">
            <h3>Total Feedback</h3>
            <p>247</p>
          </div>
          <div className="feedback-box positive">
            <h3>Positive</h3>
            <p>156</p>
          </div>
          <div className="feedback-box negative">
            <h3>Negative</h3>
            <p>45</p>
          </div>
          <div className="feedback-box neutral">
            <h3>Neutral</h3>
            <p>46</p>
          </div>
        </section>

        {/* Chart Grid */}
        <section className="visualization-grid">
          <div className="chart-section">
            <h3>Sentiment Over Time</h3>
            <div>[Line Chart Placeholder]</div>
          </div>
          <div className="chart-section">
            <h3>Sentiment Distribution</h3>
            <div>[Pie Chart Placeholder]</div>
          </div>
          <div className="chart-section">
            <h3>Feedback per Course</h3>
            <div>[Bar Chart Placeholder]</div>
          </div>
          <div className="chart-section">
            <h3>Monthly Feedback</h3>
            <div>[Area Chart Placeholder]</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
