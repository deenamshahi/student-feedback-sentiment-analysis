import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  UserPlus,
  Edit3,
  Trash2,
  Users,
  GraduationCap,
  Mail,
  Hash,
  BookOpen,
  Calendar,
  AlertCircle,
  Loader,
  X,
} from "lucide-react";
import useAxios from "../api/apiaxios";
import Sidebar from "../Components/Sidebar";

const AddStudentPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [editSelectedCourses, setEditSelectedCourses] = useState([]);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  

  const api = useAxios();
  const queryClient = useQueryClient();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // TanStack Query for fetching students
  const {
    data: students = [],
    isLoading: studentsLoading,
    error: studentsError,
  } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await api.get("/users/students");
      const studentData = response.data.data || [];

      // Process the student data - extract course IDs from enrolledCourses objects
      return studentData.map((student) => ({
        ...student,
        enrolledCourseIds: student.enrolledCourses
          ? student.enrolledCourses.map((course) => course.id)
          : [],
      }));
    },
    onError: (error) => {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students. Please try again later.");
    },
  });

  // TanStack Query for fetching courses
  const {
    data: courses = [],
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await api.get("/api/courses");
      const coursesData = response.data.data || [];

      // Ensure course IDs are integers
      return coursesData.map((course) => ({
        ...course,
        id: typeof course.id === "string" ? parseInt(course.id, 10) : course.id,
      }));
    },
    onError: (error) => {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses. Please try again later.");
    },
  });

  // Add student mutation
  const addStudentMutation = useMutation({
    mutationFn: async (studentData) => {
      const newStudent = {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        programme: studentData.programme,
        intakeYear: studentData.intakeYear,
        email: studentData.email,
        passwordHash: studentData.password,
        role: "3",
        enrolledCourseIds: studentData.enrolledCourses,
      };

      return await api.post("/register", newStudent);
    },
    onSuccess: () => {
      // Invalidate and refetch students data
      queryClient.invalidateQueries({ queryKey: ["students"] });

      // Show success message
      toast.success("Student added successfully!");

      // Reset form and selected courses
      reset();
      setSelectedCourses([]);
    },
    onError: (error) => {
      console.error("Error registering student:", error);
      toast.error("Failed to register student. Please try again.");
    },
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, studentData }) => {
      const updateData = {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        programme: studentData.programme,
        intakeYear: studentData.intakeYear,
        email: studentData.email,
        enrolledCourseIds: studentData.enrolledCourses,
      };

      // Only include password if provided
      if (studentData.password && studentData.password.trim() !== "") {
        updateData.passwordHash = studentData.password;
      }

      return await api.put(`/updateUser/${id}`, updateData);
    },
    onSuccess: () => {
      // Invalidate and refetch students data
      queryClient.invalidateQueries({ queryKey: ["students"] });

      // Show success message
      toast.success("Student updated successfully!");

      // Reset editing state
      setEditingIndex(null);
      resetEdit();
      setEditSelectedCourses([]);
    },
    onError: (error) => {
      console.error("Error updating student:", error);
      toast.error("Failed to update student. Please try again.");
    },
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/deleteUser/${id}`);
    },
    onSuccess: () => {
      // Invalidate and refetch students data
      queryClient.invalidateQueries({ queryKey: ["students"] });

      // Show success message
      toast.success("Student deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student. Please try again.");
    },
  });

  // React Hook Form for adding new students
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      programme: "",
      intakeYear: "",
      password: "",
      enrolledCourses: [],
    },
  });

  // React Hook Form for editing existing students
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: editErrors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      programme: "",
      intakeYear: "",
      password: "",
      enrolledCourses: [],
    },
  });

  // Handle course selection for add form
  const handleCourseSelect = (courseId) => {
    const currentCourses = [...selectedCourses];
    const courseIdNum = parseInt(courseId);

    if (currentCourses.includes(courseIdNum)) {
      const updatedCourses = currentCourses.filter((id) => id !== courseIdNum);
      setSelectedCourses(updatedCourses);
      setValue("enrolledCourses", updatedCourses);
    } else {
      const updatedCourses = [...currentCourses, courseIdNum];
      setSelectedCourses(updatedCourses);
      setValue("enrolledCourses", updatedCourses);
    }
  };

  // Handle course selection for edit form
  const handleEditCourseSelect = (courseId) => {
    const currentCourses = [...editSelectedCourses];
    const courseIdNum = parseInt(courseId);

    if (currentCourses.includes(courseIdNum)) {
      const updatedCourses = currentCourses.filter((id) => id !== courseIdNum);
      setEditSelectedCourses(updatedCourses);
      setValueEdit("enrolledCourses", updatedCourses);
    } else {
      const updatedCourses = [...currentCourses, courseIdNum];
      setEditSelectedCourses(updatedCourses);
      setValueEdit("enrolledCourses", updatedCourses);
    }
  };

  // Add new student handler
  const onSubmit = async (data) => {
    addStudentMutation.mutate(data);
  };

  // Delete student handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
    deleteStudentMutation.mutate(id);
  };

  // Start editing student handler
  const startEditing = (student) => {
    setEditingIndex(student.id);

    // Set form values for editing
    setValueEdit("firstName", student.firstName || "");
    setValueEdit("lastName", student.lastName || "");
    setValueEdit("email", student.email || "");
    setValueEdit("programme", student.programme || "");
    setValueEdit("intakeYear", student.intakeYear || "");

    // Set enrolled courses - ensure these are numbers
    const enrolledIds = (student.enrolledCourseIds || []).map((id) =>
      typeof id === "string" ? parseInt(id, 10) : id
    );
    setValueEdit("enrolledCourses", enrolledIds);
    setEditSelectedCourses(enrolledIds);
  };

  // Cancel editing handler
  const cancelEditing = () => {
    setEditingIndex(null);
    resetEdit();
    setEditSelectedCourses([]);
  };

  // Submit edit form handler
  const onEditSubmit = async (data) => {
    updateStudentMutation.mutate({
      id: editingIndex,
      studentData: data,
    });
  };

  // Loading and error states
  const isLoading = studentsLoading || coursesLoading;
  const error = studentsError || coursesError;
  const isSubmitting =
    addStudentMutation.isPending ||
    updateStudentMutation.isPending ||
    deleteStudentMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar Toggle Button */}
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
          {/* Toast Notification */}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-800 to-blue-400 rounded-xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Student Management
                </h2>
                <p className="text-slate-600 mt-1">
                  Easily manage students of the system
                </p>
              </div>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-800 to-blue-400 rounded-full"></div>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out z-50">
              <p className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </p>
            </div>
          )}

          {/* Add Student Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <UserPlus className="mr-2 text-blue-600" />
              Add New Student
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Enrolled Courses
                  </label>
                  <div className="relative">
                    {/* Selected courses tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedCourses.map((courseId) => {
                        const course = courses.find((c) => c.id === courseId);
                        return course ? (
                          <span
                            key={course.id}
                            className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {course.courseCode}
                            <button
                              type="button"
                              onClick={() => handleCourseSelect(course.id)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>

                    {/* Hidden field to store selected courses */}
                    <input
                      type="hidden"
                      {...register("enrolledCourses", {
                        required: "At least one course must be selected",
                        validate: (value) =>
                          value.length > 0 ||
                          "At least one course must be selected",
                      })}
                    />

                    {/* Dropdown trigger button */}
                    <button
                      type="button"
                      onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-left flex items-center justify-between hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <span className="text-slate-600">
                        {selectedCourses.length > 0
                          ? `${selectedCourses.length} course(s) selected`
                          : "Select courses..."}
                      </span>
                      <svg
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          showCourseDropdown ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown for course selection */}
                    {showCourseDropdown && (
                      <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                        {courses.length === 0 ? (
                          <div className="p-3 text-slate-500 text-sm">
                            No courses available
                          </div>
                        ) : (
                          courses.map((course) => (
                            <div
                              key={course.id}
                              onClick={() => handleCourseSelect(course.id)}
                              className={`p-3 cursor-pointer hover:bg-slate-100 flex items-center transition-colors ${
                                selectedCourses.includes(course.id)
                                  ? "bg-blue-50 border-l-4 border-blue-500"
                                  : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedCourses.includes(course.id)}
                                onChange={() => {}} // Handled by parent div click
                                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                              />
                              <div className="flex-1">
                                <span className="text-sm font-medium text-slate-800">
                                  {course.courseCode}
                                </span>
                                <span className="text-sm text-slate-600 ml-2">
                                  - {course.courseName}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {errors.enrolledCourses && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.enrolledCourses.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Programme
                  </label>
                  <input
                    {...register("programme", {
                      required: "Programme is required",
                    })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.programme && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.programme.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Intake Year
                  </label>
                  <input
                    type="number"
                    {...register("intakeYear", {
                      required: "Intake year is required",
                    })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.intakeYear && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.intakeYear.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-4 py-2 rounded-lg transition-colors flex items-center`}
                >
                  {isSubmitting ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? "Adding..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>

          {/* Students List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <Users className="mr-2 text-blue-600" />
              Registered Students
            </h2>

            {/* Loading indicator - only show on initial load */}
            {isLoading && students.length === 0 && (
              <div className="flex justify-center items-center py-8">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-2 text-slate-600">Loading students...</span>
              </div>
            )}

            {/* Error display */}
            {!isLoading && error && students.length === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && students.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  No students registered yet
                </h3>
                <p className="text-slate-600">
                  Add your first student using the form above
                </p>
              </div>
            )}

            {/* Students table - only show when data is available */}
            {students.length > 0 && (
              <div className="overflow-x-auto">
                {/* If we're refreshing data but already have items, show a small indicator */}
                {isLoading && students.length > 0 && (
                  <div className="text-sm text-slate-500 flex items-center justify-end mb-2">
                    <Loader className="w-4 h-4 mr-2 text-blue-600 animate-spin" />
                    Refreshing...
                  </div>
                )}

                <table className="w-full border-collapse">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-slate-700">
                        Student ID
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-slate-700">
                        Name
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-slate-700">
                        Email
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-slate-700">
                        Programme
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-slate-700">
                        Courses
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="p-3 text-sm text-slate-800 font-medium">
                          {student.id}
                        </td>
                        <td className="p-3 text-sm text-slate-800">
                          {editingIndex === student.id ? (
                            <div className="flex flex-col space-y-2">
                              <input
                                {...registerEdit("firstName", {
                                  required: true,
                                })}
                                className="p-1 border border-slate-300 rounded-lg text-sm"
                                placeholder="First Name"
                              />
                              <input
                                {...registerEdit("lastName", {
                                  required: true,
                                })}
                                className="p-1 border border-slate-300 rounded-lg text-sm"
                                placeholder="Last Name"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span className="font-medium">
                                {student.firstName} {student.lastName}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {editingIndex === student.id ? (
                            <input
                              {...registerEdit("email", { required: true })}
                              className="p-1 border border-slate-300 rounded-lg text-sm w-full"
                            />
                          ) : (
                            student.email
                          )}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {editingIndex === student.id ? (
                            <div className="flex flex-col space-y-2">
                              <input
                                {...registerEdit("programme", {
                                  required: true,
                                })}
                                className="p-1 border border-slate-300 rounded-lg text-sm"
                                placeholder="Programme"
                              />
                              <input
                                {...registerEdit("intakeYear", {
                                  required: true,
                                })}
                                className="p-1 border border-slate-300 rounded-lg text-sm"
                                type="number"
                                placeholder="Intake Year"
                              />
                            </div>
                          ) : (
                            <div>
                              <p>{student.programme}</p>
                              <p className="text-xs text-slate-500">
                                Intake: {student.intakeYear}
                              </p>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {editingIndex === student.id ? (
                            <div>
                              {/* Edit mode course selector */}
                              <div className="flex flex-wrap gap-1 mb-2">
                                {editSelectedCourses.map((courseId) => {
                                  const course = courses.find(
                                    (c) => c.id === courseId
                                  );
                                  return course ? (
                                    <span
                                      key={course.id}
                                      className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                    >
                                      {course.courseCode}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleEditCourseSelect(course.id)
                                        }
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  ) : null;
                                })}
                              </div>

                              {/* Hidden field for form submission */}
                              <input
                                type="hidden"
                                {...registerEdit("enrolledCourses", {
                                  required:
                                    "At least one course must be selected",
                                })}
                              />

                              {/* Dropdown for edit mode course selection */}
                              <div className="border border-slate-300 rounded-lg max-h-[150px] overflow-y-auto">
                                {courses.map((course) => (
                                  <div
                                    key={course.id}
                                    onClick={() =>
                                      handleEditCourseSelect(course.id)
                                    }
                                    className={`p-2 cursor-pointer hover:bg-slate-100 flex items-center ${
                                      editSelectedCourses.includes(course.id)
                                        ? "bg-blue-50"
                                        : ""
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={editSelectedCourses.includes(
                                        course.id
                                      )}
                                      onChange={() => {}} // Handled by parent div click
                                      className="mr-2"
                                    />
                                    <span>
                                      {course.courseCode} - {course.courseName}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {student.enrolledCourses ? (
                                // If enrolledCourses is available (direct from API)
                                student.enrolledCourses.map((course) => (
                                  <span
                                    key={course.id}
                                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {course.courseCode}
                                  </span>
                                ))
                              ) : Array.isArray(student.enrolledCourseIds) &&
                                student.enrolledCourseIds.length > 0 ? (
                                // If we need to use enrolledCourseIds and map to courses
                                courses
                                  .filter((course) => {
                                    const courseId =
                                      typeof course.id === "string"
                                        ? parseInt(course.id, 10)
                                        : course.id;

                                    return student.enrolledCourseIds.some(
                                      (id) => {
                                        const studentCourseId =
                                          typeof id === "string"
                                            ? parseInt(id, 10)
                                            : id;
                                        return courseId === studentCourseId;
                                      }
                                    );
                                  })
                                  .map((course) => (
                                    <span
                                      key={course.id}
                                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                    >
                                      {course.courseCode}
                                    </span>
                                  ))
                              ) : (
                                <span className="text-slate-400">
                                  No courses
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingIndex === student.id ? (
                            <div className="flex space-x-2">
                              <input
                                {...registerEdit("password")}
                                type="password"
                                className="p-1 border border-slate-300 rounded-lg text-sm"
                                placeholder="New Password (optional)"
                              />
                              <button
                                className={`${
                                  isSubmitting
                                    ? "bg-green-400"
                                    : "bg-green-600 hover:bg-green-700"
                                } text-white p-2 rounded-lg`}
                                onClick={handleSubmitEdit(onEditSubmit)}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <UserPlus className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                className="bg-slate-600 text-white p-2 rounded-lg hover:bg-slate-700"
                                onClick={cancelEditing}
                                disabled={isSubmitting}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                                onClick={() => startEditing(student)}
                                disabled={isSubmitting}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                                onClick={() => handleDelete(student.id)}
                                disabled={isSubmitting}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddStudentPage;
