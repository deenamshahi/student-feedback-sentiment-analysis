import React, { useState } from "react";
import StudentSidebar from "../Components/StudentSidebar";
import {
  Users,
  BookOpen,
  GraduationCap,
  User,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../api/apiaxios";
import { toast } from "react-toastify";

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const api = useAxios();

  // Fetch user data using TanStack Query
  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await api.get("/users/me");
      return response.data.data;
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Unable to Load Dashboard
          </h2>
          <p className="text-slate-600 mb-4">
            {error.response?.data?.message ||
              "There was an error loading your dashboard data."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Extract data with fallbacks
  const studentInfo = {
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    programme: userData?.programme || "N/A",
    intakeYear: userData?.intakeYear || "N/A",
    studentId: userData?.studentId || "N/A",
  };

  const enrolledCourses = userData?.enrolledCourses || [];

  // Extract unique teachers from all enrolled courses
  const allTeachers = enrolledCourses.reduce((teachers, course) => {
    if (course.teachers) {
      course.teachers.forEach((teacher) => {
        const existingTeacher = teachers.find((t) => t.id === teacher.id);
        if (!existingTeacher) {
          teachers.push({
            ...teacher,
            courses: [
              {
                id: course.id,
                courseCode: course.courseCode,
                courseName: course.courseName,
              },
            ],
          });
        } else {
          // Add course to existing teacher if not already added
          const courseExists = existingTeacher.courses.find(
            (c) => c.id === course.id
          );
          if (!courseExists) {
            existingTeacher.courses.push({
              id: course.id,
              courseCode: course.courseCode,
              courseName: course.courseName,
            });
          }
        }
      });
    }
    return teachers;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Users className="w-6 h-6 text-slate-600" />
      </button>

      {/* Student Sidebar */}
      <StudentSidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-64"
        }`}
      >
        <main className="p-6 lg:p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Welcome back, {studentInfo.firstName}!
                </h2>
                <p className="text-slate-600 mt-1">
                  Ready to continue your learning journey?
                </p>
              </div>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>

          {/* Student Info Cards */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Info */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">
                      Student ID
                    </p>
                    <p className="text-lg font-bold text-slate-800 truncate">
                      {studentInfo.studentId}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Name:</span>{" "}
                    {studentInfo.firstName} {studentInfo.lastName}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Programme:</span>{" "}
                    {studentInfo.programme}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Intake:</span>{" "}
                    {studentInfo.intakeYear}
                  </p>
                  <p className="text-sm text-slate-600 truncate">
                    <span className="font-medium">Email:</span>{" "}
                    {studentInfo.email}
                  </p>
                </div>
              </div>

              {/* Enrolled Courses */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">
                      Enrolled Courses
                    </p>
                    <p className="text-3xl font-bold text-slate-800">
                      {enrolledCourses.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-green-600">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                  <span className="text-sm text-slate-500">this semester</span>
                </div>
              </div>
            </div>
          </section>

          {/* Enrolled Courses Section */}
          <section className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-800">
                    Your Enrolled Courses
                  </h3>
                </div>
                <div className="text-sm text-slate-500">
                  {enrolledCourses.length} courses
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {course.courseCode}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-3">
                      {course.courseName}
                    </h4>
                    <p className="text-slate-600 text-sm mb-4">
                      {course.description}
                    </p>

                    {/* Teachers for this course */}
                    {course.teachers && course.teachers.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-2">
                          Teachers:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {course.teachers.map((teacher) => (
                            <span
                              key={teacher.id}
                              className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                            >
                              {teacher.firstName} {teacher.lastName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {enrolledCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">
                    No courses enrolled
                  </p>
                  <p className="text-sm text-slate-400">
                    Contact your administrator to enroll in courses
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Your Teachers Section */}
          <section>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-slate-800">
                    Your Teachers
                  </h3>
                </div>
                <div className="text-sm text-slate-500">
                  {allTeachers.length} teachers
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {allTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="p-6 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                        {teacher.teacherId}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-3">
                      {teacher.firstName} {teacher.lastName}
                    </h4>
                    <p className="text-slate-600 text-sm mb-4">
                      <span className="font-medium">Department:</span>{" "}
                      {teacher.department}
                    </p>

                    {/* Courses taught by this teacher */}
                    {teacher.courses && teacher.courses.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-2">
                          Teaching Courses:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {teacher.courses.map((course) => (
                            <span
                              key={course.id}
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                            >
                              {course.courseCode}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {allTeachers.length === 0 && (
                <div className="text-center py-12">
                  <UserCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">
                    No teachers assigned
                  </p>
                  <p className="text-sm text-slate-400">
                    Teachers will appear when you enroll in courses
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
