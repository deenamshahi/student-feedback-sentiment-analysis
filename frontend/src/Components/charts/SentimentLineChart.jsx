// filepath: e:\esewa\mainproject\student-feedback-sentiment-analysis\frontend\src\components\charts\SentimentLineChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SentimentLineChart = ({ data }) => {
  // Mock time series data - replace with actual data from your API
  const timeSeriesData = [
    { month: "Jan", positive: 45, negative: 20, neutral: 35 },
    { month: "Feb", positive: 52, negative: 18, neutral: 30 },
    { month: "Mar", positive: 48, negative: 25, neutral: 27 },
    { month: "Apr", positive: 61, negative: 15, neutral: 24 },
    { month: "May", positive: 55, negative: 22, neutral: 23 },
    {
      month: "Jun",
      positive: data.positive,
      negative: data.negative,
      neutral: data.neutral,
    },
  ];

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
      <LineChart data={timeSeriesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="positive"
          stroke="#10b981"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="negative"
          stroke="#ef4444"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="neutral"
          stroke="#f59e0b"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SentimentLineChart;
