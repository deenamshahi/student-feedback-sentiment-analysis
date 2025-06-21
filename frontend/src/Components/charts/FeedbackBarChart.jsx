import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../api/apiaxios";

const FeedbackBarChart = () => {
  const api = useAxios();

  // Fetch course feedback data
  const {
    data: chartData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["analytics", "courses-feedback-summary"],
    queryFn: async () => {
      const response = await api.get("/api/analytics/courses/feedback/summary");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const totalFeedback = payload.reduce(
        (sum, entry) => sum + entry.value,
        0
      );

      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span style={{ color: entry.color }}>
                {entry.name}: {entry.value}
              </span>
            </p>
          ))}
          <div className="mt-2 pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-600">
              Total Feedback: {totalFeedback}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-slate-600">
            Loading course feedback data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">
            Failed to load course feedback data
          </p>
          <p className="text-xs text-slate-500">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-sm text-slate-600">
            No course feedback data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="courseCode"
          angle={-45}
          textAnchor="end"
          height={60}
          fontSize={12}
          stroke="#64748b"
        />
        <YAxis fontSize={12} stroke="#64748b" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="positive"
          fill="#10b981"
          name="Positive"
          radius={[2, 2, 0, 0]}
        />
        <Bar
          dataKey="negative"
          fill="#ef4444"
          name="Negative"
          radius={[2, 2, 0, 0]}
        />
        <Bar
          dataKey="neutral"
          fill="#f59e0b"
          name="Neutral"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FeedbackBarChart;
