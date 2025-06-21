import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SentimentPieChart = ({ data }) => {
  const allData = [
    { name: 'Positive', value: data.positive, color: '#10b981' },
    { name: 'Negative', value: data.negative, color: '#ef4444' },
    { name: 'Neutral', value: data.neutral, color: '#f59e0b' }
  ];

  // Filter out entries with zero or undefined values
  const chartData = allData.filter(entry => entry.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-800">{data.name}</p>
          <p className="text-sm text-slate-600">Count: {data.value}</p>
        </div>
      );
    }
    return null;
  };

  // If no data to show
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500">No data to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SentimentPieChart;