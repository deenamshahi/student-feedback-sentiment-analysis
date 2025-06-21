import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import { Users, TrendingUp, TrendingDown, Minus, BarChart3, PieChart, Activity, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Users className="w-6 h-6 text-slate-600" />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>
        <main className="p-6 lg:p-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Analytics Dashboard</h2>
                <p className="text-slate-600 mt-1">Monitor feedback sentiment and engagement across all courses</p>
              </div>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>

          {/* Feedback Summary Cards */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Feedback */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Total Feedback</p>
                    <p className="text-3xl font-bold text-slate-800">247</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+12%</span>
                  </div>
                  <span className="text-sm text-slate-500">from last month</span>
                </div>
              </div>

              {/* Positive Feedback */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Positive</p>
                    <p className="text-3xl font-bold text-slate-800">156</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+8%</span>
                  </div>
                  <span className="text-sm text-slate-500">satisfaction rate</span>
                </div>
              </div>

              {/* Negative Feedback */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Negative</p>
                    <p className="text-3xl font-bold text-slate-800">45</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-medium">-3%</span>
                  </div>
                  <span className="text-sm text-slate-500">improvement needed</span>
                </div>
              </div>

              {/* Neutral Feedback */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl">
                    <Minus className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Neutral</p>
                    <p className="text-3xl font-bold text-slate-800">46</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Minus className="w-4 h-4" />
                    <span className="text-sm font-medium">0%</span>
                  </div>
                  <span className="text-sm text-slate-500">stable feedback</span>
                </div>
              </div>
            </div>
          </section>

          {/* Chart Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sentiment Over Time */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-800">Sentiment Over Time</h3>
              </div>
              <div className="h-64 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Line Chart Visualization</p>
                  <p className="text-sm text-slate-400">Tracking sentiment trends over time</p>
                </div>
              </div>
            </div>

            {/* Sentiment Distribution */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <PieChart className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-800">Sentiment Distribution</h3>
              </div>
              <div className="h-64 bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Pie Chart Visualization</p>
                  <p className="text-sm text-slate-400">Overall sentiment breakdown</p>
                </div>
              </div>
            </div>

            {/* Feedback per Course */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-slate-800">Feedback per Course</h3>
              </div>
              <div className="h-64 bg-gradient-to-br from-slate-50 to-green-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Bar Chart Visualization</p>
                  <p className="text-sm text-slate-400">Course-wise feedback analysis</p>
                </div>
              </div>
            </div>

            {/* Monthly Feedback */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-slate-800">Monthly Feedback</h3>
              </div>
              <div className="h-64 bg-gradient-to-br from-slate-50 to-orange-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Area Chart Visualization</p>
                  <p className="text-sm text-slate-400">Monthly feedback trends</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;