import React, { useState } from 'react';
import StudentSidebar from '../Components/StudentSidebar';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Star, 
  ChevronRight,
  Calendar,
  User,
  Award
} from 'lucide-react';

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Static data for demonstration
  const studentInfo = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@university.edu",
    programme: "Computer Science",
    intakeYear: "2022"
  };

  const enrolledCourses = [
    {
      id: 1,
      courseCode: "CS101",
      courseName: "Introduction to Programming",
      instructor: "Dr. Sarah Wilson",
      credits: 3,
      schedule: "Mon, Wed, Fri - 9:00 AM",
      description: "Learn the fundamentals of programming using Python. Cover variables, control structures, functions, and basic data structures."
    },
    {
      id: 2,
      courseCode: "CS201",
      courseName: "Data Structures and Algorithms",
      instructor: "Prof. Michael Chen",
      credits: 4,
      schedule: "Tue, Thu - 2:00 PM",
      description: "Study essential data structures like arrays, linked lists, trees, and graphs. Learn algorithm design and analysis."
    },
    {
      id: 3,
      courseCode: "CS301",
      courseName: "Database Management Systems",
      instructor: "Dr. Emily Rodriguez",
      credits: 3,
      schedule: "Mon, Wed - 11:00 AM",
      description: "Comprehensive study of database design, SQL, normalization, and database administration concepts."
    },
    {
      id: 4,
      courseCode: "CS250",
      courseName: "Web Development",
      instructor: "Prof. David Kim",
      credits: 3,
      schedule: "Tue, Thu - 10:00 AM",
      description: "Learn modern web development using HTML, CSS, JavaScript, and popular frameworks like React."
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "assignment",
      course: "CS101",
      title: "Programming Assignment 3 submitted",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "feedback",
      course: "CS201",
      title: "Feedback submitted for mid-term review",
      time: "1 day ago"
    },
    {
      id: 3,
      type: "grade",
      course: "CS301",
      title: "Quiz 2 graded - Score: 92%",
      time: "3 days ago"
    }
  ];

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
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Profile Info */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Student ID</p>
                    <p className="text-xl font-bold text-slate-800">CS{studentInfo.intakeYear}001</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">Programme: {studentInfo.programme}</p>
                  <p className="text-sm text-slate-600">Intake: {studentInfo.intakeYear}</p>
                </div>
              </div>

              {/* Enrolled Courses */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Enrolled Courses</p>
                    <p className="text-3xl font-bold text-slate-800">{enrolledCourses.length}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-green-600">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                  <span className="text-sm text-slate-500">this semester</span>
                </div>
              </div>

              {/* Total Credits */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Total Credits</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {enrolledCourses.reduce((sum, course) => sum + course.credits, 0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-purple-600">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">Good load</span>
                  </div>
                  <span className="text-sm text-slate-500">recommended range</span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Activities</p>
                    <p className="text-3xl font-bold text-slate-800">{recentActivities.length}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Recent</span>
                  </div>
                  <span className="text-sm text-slate-500">this week</span>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enrolled Courses */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-800">Your Enrolled Courses</h3>
                  </div>
                  <div className="text-sm text-slate-500">
                    {enrolledCourses.length} courses
                  </div>
                </div>

                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div 
                      key={course.id} 
                      className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                              {course.courseCode}
                            </span>
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                              {course.credits} Credits
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-slate-800 mb-2">
                            {course.courseName}
                          </h4>
                          <p className="text-slate-600 text-sm mb-3">
                            {course.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{course.instructor}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{course.schedule}</span>
                            </div>
                          </div>
                        </div>
                        <button className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="flex items-center space-x-3 mb-6">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-slate-800">Recent Activities</h3>
                </div>

                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="p-4 bg-gradient-to-r from-slate-50 to-orange-50 rounded-xl border border-slate-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'assignment' ? 'bg-blue-100' :
                          activity.type === 'feedback' ? 'bg-green-100' : 'bg-purple-100'
                        }`}>
                          {activity.type === 'assignment' ? (
                            <BookOpen className={`w-4 h-4 ${
                              activity.type === 'assignment' ? 'text-blue-600' :
                              activity.type === 'feedback' ? 'text-green-600' : 'text-purple-600'
                            }`} />
                          ) : activity.type === 'feedback' ? (
                            <Star className="w-4 h-4 text-green-600" />
                          ) : (
                            <Award className="w-4 h-4 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                              {activity.course}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-800 mb-1">
                            {activity.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200">
                  View All Activities
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;