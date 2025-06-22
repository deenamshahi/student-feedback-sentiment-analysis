import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import SentimentPieChart from "../components/charts/SentimentPieChart";
import FeedbackBarChart from "../components/charts/FeedbackBarChart";
import TeacherFeedbackChart from "../components/charts/TeacherFeedbackChart";
import {
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  PieChart,
  Calendar,
  RefreshCw,
  ChevronDown,
  BookOpen,
  User,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../api/apiaxios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("total");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const api = useAxios();

  // Filter options for the dropdown
  const filterOptions = [
    { value: "total", label: "All Feedback (Teachers + Courses)" },
    { value: "teachers", label: "Teacher Feedback Only" },
    { value: "courses", label: "Course Feedback Only" },
  ];

  // Fetch courses for dropdown
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await api.get("/api/courses");
      return response.data.data;
    },
    onError: (error) => {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch teachers for dropdown
  const {
    data: teachersData,
    isLoading: teachersLoading,
    error: teachersError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await api.get("/users/teachers");
      return response.data.data;
    },
    onError: (error) => {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to load teachers");
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch sentiment analytics data using TanStack Query
  const {
    data: analyticsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["analytics", "sentiment"],
    queryFn: async () => {
      const response = await api.get("/api/analytics/feedback/sentiment");
      return response.data.data;
    },
    onError: (error) => {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    },
    retry: 3,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    enabled: !selectedCourse && !selectedTeacher, // Only fetch when no specific filter is selected
  });

  // Fetch specific course sentiment analytics
  const {
    data: courseAnalyticsData,
    isLoading: courseAnalyticsLoading,
    error: courseAnalyticsError,
    refetch: refetchCourseAnalytics,
  } = useQuery({
    queryKey: ["analytics", "course", selectedCourse],
    queryFn: async () => {
      const response = await api.get(
        `/api/analytics/courses/${selectedCourse}/feedback/sentiment`
      );
      return response.data.data;
    },
    onError: (error) => {
      console.error("Error fetching course analytics:", error);
      toast.error("Failed to load course analytics data");
    },
    enabled: !!selectedCourse, // Only fetch when a course is selected
    staleTime: 2 * 60 * 1000,
  });

  // Fetch specific teacher sentiment analytics
  const {
    data: teacherAnalyticsData,
    isLoading: teacherAnalyticsLoading,
    error: teacherAnalyticsError,
    refetch: refetchTeacherAnalytics,
  } = useQuery({
    queryKey: ["analytics", "teacher", selectedTeacher],
    queryFn: async () => {
      const selectedTeacherData = teachersData?.find(
        (teacher) => teacher.id === parseInt(selectedTeacher)
      );
      const teacherDbId = selectedTeacherData?.teacherDbId;
      if (!teacherDbId) {
        throw new Error("Teacher database ID not found");
      }
      const response = await api.get(
        `/api/analytics/teachers/${teacherDbId}/feedback/sentiment`
      );
      return response.data.data;
    },
    onError: (error) => {
      console.error("Error fetching teacher analytics:", error);
      toast.error("Failed to load teacher analytics data");
    },
    enabled: !!selectedTeacher && !!teachersData, // Only fetch when a teacher is selected and teachers data is available
    staleTime: 2 * 60 * 1000,
  });

  // Handle dropdown selections - only one can be active at a time
  const handleFilterSelect = (filterValue) => {
    setSelectedFilter(filterValue);
    setSelectedCourse("");
    setSelectedTeacher("");
    setShowFilterDropdown(false);
    setShowCourseDropdown(false);
    setShowTeacherDropdown(false);
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedFilter("");
    setSelectedTeacher("");
    setShowCourseDropdown(false);
    setShowFilterDropdown(false);
    setShowTeacherDropdown(false);
  };

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeacher(teacherId);
    setSelectedFilter("");
    setSelectedCourse("");
    setShowTeacherDropdown(false);
    setShowFilterDropdown(false);
    setShowCourseDropdown(false);
  };

  // Get current data based on selected filter/course/teacher
  const getCurrentData = () => {
    if (selectedCourse && courseAnalyticsData) {
      return courseAnalyticsData;
    }

    if (selectedTeacher && teacherAnalyticsData) {
      return teacherAnalyticsData;
    }

    if (!analyticsData) return { positive: 0, negative: 0, neutral: 0 };

    switch (selectedFilter) {
      case "teachers":
        return (
          analyticsData.teacherFeedback || {
            positive: 0,
            negative: 0,
            neutral: 0,
          }
        );
      case "courses":
        return (
          analyticsData.courseFeedback || {
            positive: 0,
            negative: 0,
            neutral: 0,
          }
        );
      default:
        return analyticsData.total || { positive: 0, negative: 0, neutral: 0 };
    }
  };

  const currentData = getCurrentData();
  const totalFeedback =
    currentData.positive + currentData.negative + currentData.neutral;

  // Handle refresh based on current selection
  const handleRefresh = () => {
    if (selectedCourse) {
      refetchCourseAnalytics();
    } else if (selectedTeacher) {
      refetchTeacherAnalytics();
    } else {
      refetch();
    }
  };

  // Get current loading state
  const currentLoading = selectedCourse
    ? courseAnalyticsLoading
    : selectedTeacher
    ? teacherAnalyticsLoading
    : isLoading;

  // Get current error state
  const currentError = selectedCourse
    ? courseAnalyticsError
    : selectedTeacher
    ? teacherAnalyticsError
    : error;

  // Get selected display text
  const getSelectedDisplayText = () => {
    if (selectedCourse) {
      const course = coursesData?.find(
        (c) => c.id === parseInt(selectedCourse)
      );
      return `Course: ${course?.courseCode} - ${course?.courseName}`;
    }
    if (selectedTeacher) {
      const teacher = teachersData?.find(
        (t) => t.id === parseInt(selectedTeacher)
      );
      return `Teacher: ${teacher?.firstName} ${teacher?.lastName}`;
    }
    return (
      filterOptions.find((option) => option.value === selectedFilter)?.label ||
      "All Feedback"
    );
  };

  // Loading state
  if (currentLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (currentError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Unable to Load Analytics
          </h2>
          <p className="text-slate-600 mb-4">
            {currentError.response?.data?.message ||
              "There was an error loading the analytics data."}
          </p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
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
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-64"
        }`}
      >
        <main className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Analytics Dashboard
                </h2>
                <p className="text-slate-600 mt-1">
                  Monitor feedback sentiment and engagement across all courses
                </p>
              </div>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>

          {/* Filter Controls */}
          <section className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-800">
                    Feedback Analytics
                  </h3>
                </div>
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* General Filter Dropdown */}
                <div className="relative">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Filter by feedback type:
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowFilterDropdown(!showFilterDropdown);
                        setShowCourseDropdown(false);
                        setShowTeacherDropdown(false);
                      }}
                      className={`w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between ${
                        selectedFilter ? "bg-blue-50 border-blue-300" : ""
                      }`}
                    >
                      <span
                        className={
                          selectedFilter
                            ? "text-blue-800 font-medium"
                            : "text-slate-500"
                        }
                      >
                        {selectedFilter
                          ? filterOptions.find(
                              (option) => option.value === selectedFilter
                            )?.label
                          : "Select feedback type"}
                      </span>
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </button>

                    {showFilterDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20">
                        {filterOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleFilterSelect(option.value)}
                            className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 border-b border-slate-100 last:border-b-0 rounded-xl ${
                              selectedFilter === option.value
                                ? "bg-blue-50 text-blue-700"
                                : ""
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Dropdown */}
                <div className="relative">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Or select specific course:
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowCourseDropdown(!showCourseDropdown);
                        setShowFilterDropdown(false);
                        setShowTeacherDropdown(false);
                      }}
                      className={`w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 flex items-center justify-between ${
                        selectedCourse ? "bg-green-50 border-green-300" : ""
                      }`}
                      disabled={coursesLoading}
                    >
                      <span
                        className={
                          selectedCourse
                            ? "text-green-800 font-medium"
                            : "text-slate-500"
                        }
                      >
                        {coursesLoading
                          ? "Loading courses..."
                          : selectedCourse
                          ? (() => {
                              const course = coursesData?.find(
                                (c) => c.id === parseInt(selectedCourse)
                              );
                              return `${course?.courseCode} - ${course?.courseName}`;
                            })()
                          : "Select a course"}
                      </span>
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </button>

                    {showCourseDropdown && coursesData && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                        {coursesData.map((course) => (
                          <button
                            key={course.id}
                            onClick={() => handleCourseSelect(course.id)}
                            className={`w-full px-4 py-3 text-left hover:bg-green-50 transition-colors duration-200 border-b border-slate-100 last:border-b-0 ${
                              selectedCourse === course.id.toString()
                                ? "bg-green-50 text-green-700"
                                : ""
                            }`}
                          >
                            <div className="font-medium">
                              {course.courseCode}
                            </div>
                            <div className="text-sm text-slate-600">
                              {course.courseName}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Teacher Dropdown */}
                <div className="relative">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Or select specific teacher:
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowTeacherDropdown(!showTeacherDropdown);
                        setShowFilterDropdown(false);
                        setShowCourseDropdown(false);
                      }}
                      className={`w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 flex items-center justify-between ${
                        selectedTeacher ? "bg-purple-50 border-purple-300" : ""
                      }`}
                      disabled={teachersLoading}
                    >
                      <span
                        className={
                          selectedTeacher
                            ? "text-purple-800 font-medium"
                            : "text-slate-500"
                        }
                      >
                        {teachersLoading
                          ? "Loading teachers..."
                          : selectedTeacher
                          ? (() => {
                              const teacher = teachersData?.find(
                                (t) => t.id === parseInt(selectedTeacher)
                              );
                              return `${teacher?.firstName} ${teacher?.lastName}`;
                            })()
                          : "Select a teacher"}
                      </span>
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </button>

                    {showTeacherDropdown && teachersData && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
                        {teachersData.map((teacher) => (
                          <button
                            key={teacher.id}
                            onClick={() => handleTeacherSelect(teacher.id)}
                            className={`w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors duration-200 border-b border-slate-100 last:border-b-0 ${
                              selectedTeacher === teacher.id.toString()
                                ? "bg-purple-50 text-purple-700"
                                : ""
                            }`}
                          >
                            <div className="font-medium">
                              {teacher.firstName} {teacher.lastName}
                            </div>
                            <div className="text-sm text-slate-600">
                              {teacher.department}
                            </div>
                            <div className="text-xs text-purple-600">
                              {teacher.teachingCourses
                                ?.map((course) => course.courseCode)
                                .join(", ")}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Selection Display */}
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Currently viewing:</span>{" "}
                  {getSelectedDisplayText()}
                </p>
              </div>
            </div>
          </section>

          {/* Stats Cards */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Feedback Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">
                      Total Feedback
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {totalFeedback}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-blue-600">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm text-slate-500">
                      Total feedback count
                    </span>
                  </div>
                </div>
              </div>

              {/* Positive Feedback Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">
                      Positive
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {currentData.positive}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm text-slate-500">
                      Positive sentiment feedback
                    </span>
                  </div>
                </div>
              </div>

              {/* Negative Feedback Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">
                      Negative
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {currentData.negative}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm text-slate-500">
                      Negative sentiment feedback
                    </span>
                  </div>
                </div>
              </div>

              {/* Neutral Feedback Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl">
                    <Minus className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">
                      Neutral
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {currentData.neutral}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-slate-600">
                    <Minus className="w-4 h-4" />
                    <span className="text-sm text-slate-500">
                      Neutral sentiment feedback
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Breakdown by Type */}
          <section className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <PieChart className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-800">
                  Feedback Breakdown by Type
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* All Feedback */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">
                    All Feedback
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Positive:</span>
                      <span className="font-bold text-green-600">
                        {analyticsData?.total?.positive || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Negative:</span>
                      <span className="font-bold text-red-600">
                        {analyticsData?.total?.negative || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Neutral:</span>
                      <span className="font-bold text-yellow-600">
                        {analyticsData?.total?.neutral || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Teacher Feedback */}
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">
                    Teacher Feedback
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Positive:</span>
                      <span className="font-bold text-green-600">
                        {analyticsData?.teacherFeedback?.positive || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Negative:</span>
                      <span className="font-bold text-red-600">
                        {analyticsData?.teacherFeedback?.negative || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Neutral:</span>
                      <span className="font-bold text-yellow-600">
                        {analyticsData?.teacherFeedback?.neutral || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Feedback */}
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">
                    Course Feedback
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Positive:</span>
                      <span className="font-bold text-green-600">
                        {analyticsData?.courseFeedback?.positive || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Negative:</span>
                      <span className="font-bold text-red-600">
                        {analyticsData?.courseFeedback?.negative || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Neutral:</span>
                      <span className="font-bold text-yellow-600">
                        {analyticsData?.courseFeedback?.neutral || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sentiment Distribution - Expanded to take more space */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <PieChart className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-800">
                  Sentiment Distribution
                </h3>
              </div>
              <div className="h-80">
                <SentimentPieChart data={currentData} />
              </div>
            </div>

            {/* Feedback per Course */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-slate-800">
                  Feedback per Course
                </h3>
              </div>
              <div className="h-80">
                <FeedbackBarChart
                  coursesData={coursesData}
                  analyticsData={analyticsData}
                />
              </div>
            </div>

            {/* Feedback per Teacher */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-slate-800">
                  Feedback per Teacher
                </h3>
              </div>
              <div className="h-80">
                <TeacherFeedbackChart />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
