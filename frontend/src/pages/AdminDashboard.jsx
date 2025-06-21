import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import { Users, TrendingUp, TrendingDown, Minus, BarChart3, PieChart, Activity, Calendar, ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../api/apiaxios';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('total');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const api = useAxios();

  // Filter options for the dropdown
  const filterOptions = [
    { value: 'total', label: 'All Feedback (Teachers + Courses)' },
    { value: 'teachers', label: 'Teacher Feedback Only' },
    { value: 'courses', label: 'Course Feedback Only' }
  ];

  // Fetch sentiment analytics data using TanStack Query
  const {
    data: analyticsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['analytics', 'sentiment'],
    queryFn: async () => {
      const response = await api.get('/api/analytics/feedback/sentiment');
      return response.data.data;
    },
    onError: (error) => {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    },
    retry: 3,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Get current data based on selected filter
  const getCurrentData = () => {
    if (!analyticsData) return { positive: 0, negative: 0, neutral: 0 };
    
    switch (selectedFilter) {
      case 'teachers':
        return analyticsData.teacherFeedback;
      case 'courses':
        return analyticsData.courseFeedback;
      case 'total':
      default:
        return analyticsData.total;
    }
  };

  const currentData = getCurrentData();
  const totalFeedback = currentData.positive + currentData.negative + currentData.neutral;

  // Calculate percentages for trends (mock calculation - you can replace with actual logic)
  const calculateTrend = (current, type) => {
    // Mock trend calculation - in a real app, you'd compare with previous period
    const trends = {
      positive: { value: 8, isPositive: true },
      negative: { value: 3, isPositive: false },
      neutral: { value: 0, isPositive: true }
    };
    return trends[type] || { value: 0, isPositive: true };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        >
          <Users className="w-6 h-6 text-slate-600" />
        </button>

        <Sidebar isOpen={sidebarOpen} />

        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>
          <main className="p-6 lg:p-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md mx-auto p-6">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Unable to Load Analytics
                </h2>
                <p className="text-slate-600 mb-4">
                  {error.response?.data?.message || "There was an error loading the analytics data."}
                </p>
                <button
                  onClick={() => refetch()}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

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

          {/* Filter Dropdown */}
          <section className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-800">Feedback Analytics</h3>
                </div>
                <button
                  onClick={() => refetch()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
              
              <div className="relative max-w-md">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Filter by feedback type:
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
                  >
                    <span className="text-slate-800">
                      {filterOptions.find(option => option.value === selectedFilter)?.label}
                    </span>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </button>

                  {showFilterDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10">
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedFilter(option.value);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 border-b border-slate-100 last:border-b-0 rounded-xl ${
                            selectedFilter === option.value ? 'bg-blue-50 text-blue-700' : ''
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

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
                    <p className="text-3xl font-bold text-slate-800">{totalFeedback}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-blue-600">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {selectedFilter === 'total' ? 'All' : selectedFilter === 'teachers' ? 'Teachers' : 'Courses'}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500">feedback count</span>
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
                    <p className="text-3xl font-bold text-slate-800">{currentData.positive}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+{calculateTrend(currentData.positive, 'positive').value}%</span>
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
                    <p className="text-3xl font-bold text-slate-800">{currentData.negative}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-medium">-{calculateTrend(currentData.negative, 'negative').value}%</span>
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
                    <p className="text-3xl font-bold text-slate-800">{currentData.neutral}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Minus className="w-4 h-4" />
                    <span className="text-sm font-medium">{calculateTrend(currentData.neutral, 'neutral').value}%</span>
                  </div>
                  <span className="text-sm text-slate-500">stable feedback</span>
                </div>
              </div>
            </div>
          </section>

          {/* Detailed Breakdown Section */}
          <section className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <PieChart className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-800">Feedback Breakdown by Type</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* All Feedback */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">All Feedback</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Positive:</span>
                      <span className="font-bold text-green-600">{analyticsData?.total?.positive || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Negative:</span>
                      <span className="font-bold text-red-600">{analyticsData?.total?.negative || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Neutral:</span>
                      <span className="font-bold text-yellow-600">{analyticsData?.total?.neutral || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Teacher Feedback */}
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">Teacher Feedback</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Positive:</span>
                      <span className="font-bold text-green-600">{analyticsData?.teacherFeedback?.positive || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Negative:</span>
                      <span className="font-bold text-red-600">{analyticsData?.teacherFeedback?.negative || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Neutral:</span>
                      <span className="font-bold text-yellow-600">{analyticsData?.teacherFeedback?.neutral || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Course Feedback */}
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">Course Feedback</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Positive:</span>
                      <span className="font-bold text-green-600">{analyticsData?.courseFeedback?.positive || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Negative:</span>
                      <span className="font-bold text-red-600">{analyticsData?.courseFeedback?.negative || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Neutral:</span>
                      <span className="font-bold text-yellow-600">{analyticsData?.courseFeedback?.neutral || 0}</span>
                    </div>
                  </div>
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