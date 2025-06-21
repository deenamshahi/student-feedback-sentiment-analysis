import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FeedbackBarChart = ({ coursesData, analyticsData }) => {
  // Prepare data for bar chart
  const chartData = coursesData?.map(course => ({
    courseCode: course.courseCode,
    courseName: course.courseName,
    feedbackCount: Math.floor(Math.random() * 50) + 10, // Replace with actual feedback count
    positive: Math.floor(Math.random() * 30) + 5,
    negative: Math.floor(Math.random() * 15) + 2,
    neutral: Math.floor(Math.random() * 20) + 3
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="courseCode" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="positive" fill="#10b981" />
        <Bar dataKey="negative" fill="#ef4444" />
        <Bar dataKey="neutral" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FeedbackBarChart;