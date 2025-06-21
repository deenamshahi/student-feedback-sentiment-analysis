import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  X,
  UserCheck,
  Mail,
  Building2,
  BookOpen,
  ChevronDown,
  AlertCircle,
  Loader,
  UserPlus,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import useAxios from "../api/apiaxios";

const ManageTeacherPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [editSelectedCourses, setEditSelectedCourses] = useState([]);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  const api = useAxios();
  const queryClient = useQueryClient();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // TanStack Query for fetching teachers
  const {
    data: teachers = [],
    isLoading: teachersLoading,
    error: teachersError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const response = await api.get("/users/teachers");
      const teacherData = response.data.data || [];

      // Process the teacher data - extract course IDs from teachingCourses objects
      return teacherData.map((teacher) => ({
        ...teacher,
        teachingCourseIds: teacher.teachingCourses
          ? teacher.teachingCourses.map((course) => course.id)
          : [],
      }));
    },
    onError: (error) => {
      console.error("Error fetching teachers:", error);
      toast.error("Failed to load teachers. Please try again later.");
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

  // Add teacher mutation
  const addTeacherMutation = useMutation({
    mutationFn: async (teacherData) => {
      const newTeacher = {
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        email: teacherData.email,
        department: teacherData.department,
        passwordHash: teacherData.passwordHash,
        role: "2", // Teacher role
        teachingCourseIds: teacherData.teachingCourseIds,
      };

      return await api.post("/register", newTeacher);
    },
    onSuccess: () => {
      // Invalidate and refetch teachers data
      queryClient.invalidateQueries({ queryKey: ["teachers"] });

      // Show success message
      toast.success("Teacher added successfully!");

      // Reset form and selected courses
      reset();
      setSelectedCourses([]);
    },
    onError: (error) => {
      console.error("Error registering teacher:", error);
      toast.error("Failed to register teacher. Please try again.");
    },
  });

  // Update teacher mutation
  const updateTeacherMutation = useMutation({
    mutationFn: async ({ id, teacherData }) => {
      const updateData = {
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        email: teacherData.email,
        department: teacherData.department,
        teachingCourseIds: teacherData.teachingCourseIds,
      };

      // Only include password if provided
      if (teacherData.passwordHash && teacherData.passwordHash.trim() !== "") {
        updateData.passwordHash = teacherData.passwordHash;
      }

      return await api.put(`/updateUser/${id}`, updateData);
    },
    onSuccess: () => {
      // Invalidate and refetch teachers data
      queryClient.invalidateQueries({ queryKey: ["teachers"] });

      // Show success message
      toast.success("Teacher updated successfully!");

      // Reset editing state
      setEditingIndex(null);
      resetEdit();
      setEditSelectedCourses([]);
    },
    onError: (error) => {
      console.error("Error updating teacher:", error);
      toast.error("Failed to update teacher. Please try again.");
    },
  });

  // Delete teacher mutation
  const deleteTeacherMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/deleteUser/${id}`);
    },
    onSuccess: () => {
      // Invalidate and refetch teachers data
      queryClient.invalidateQueries({ queryKey: ["teachers"] });

      // Show success message
      toast.success("Teacher deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting teacher:", error);
      toast.error("Failed to delete teacher. Please try again.");
    },
  });

  // React Hook Form for adding new teachers
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
      department: "",
      passwordHash: "",
      teachingCourseIds: [],
    },
  });

  // React Hook Form for editing existing teachers
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
      department: "",
      passwordHash: "",
      teachingCourseIds: [],
    },
  });

  // Handle course selection for add form
  const handleCourseSelect = (courseId) => {
    const currentCourses = [...selectedCourses];
    const courseIdNum = parseInt(courseId);

    if (currentCourses.includes(courseIdNum)) {
      const updatedCourses = currentCourses.filter((id) => id !== courseIdNum);
      setSelectedCourses(updatedCourses);
      setValue("teachingCourseIds", updatedCourses);
    } else {
      const updatedCourses = [...currentCourses, courseIdNum];
      setSelectedCourses(updatedCourses);
      setValue("teachingCourseIds", updatedCourses);
    }
  };

  // Handle course selection for edit form
  const handleEditCourseSelect = (courseId) => {
    const currentCourses = [...editSelectedCourses];
    const courseIdNum = parseInt(courseId);

    if (currentCourses.includes(courseIdNum)) {
      const updatedCourses = currentCourses.filter((id) => id !== courseIdNum);
      setEditSelectedCourses(updatedCourses);
      setValueEdit("teachingCourseIds", updatedCourses);
    } else {
      const updatedCourses = [...currentCourses, courseIdNum];
      setEditSelectedCourses(updatedCourses);
      setValueEdit("teachingCourseIds", updatedCourses);
    }
  };

  // Add new teacher handler
  const onSubmit = async (data) => {
    addTeacherMutation.mutate(data);
  };

  // Delete teacher handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) {
      return;
    }
    deleteTeacherMutation.mutate(id);
  };

  // Start editing teacher handler
  const startEditing = (teacher) => {
    setEditingIndex(teacher.id);

    // Set form values for editing
    setValueEdit("firstName", teacher.firstName || "");
    setValueEdit("lastName", teacher.lastName || "");
    setValueEdit("email", teacher.email || "");
    setValueEdit("department", teacher.department || "");

    // Set teaching courses - ensure these are numbers
    const teachingIds = (teacher.teachingCourseIds || []).map((id) =>
      typeof id === "string" ? parseInt(id, 10) : id
    );
    setValueEdit("teachingCourseIds", teachingIds);
    setEditSelectedCourses(teachingIds);
  };

  // Cancel editing handler
  const cancelEditing = () => {
    setEditingIndex(null);
    resetEdit();
    setEditSelectedCourses([]);
  };

  // Submit edit form handler
  const onEditSubmit = async (data) => {
    updateTeacherMutation.mutate({
      id: editingIndex,
      teacherData: data,
    });
  };

  // Loading and error states
  const isLoading = teachersLoading || coursesLoading;
  const error = teachersError || coursesError;
  const isSubmitting =
    addTeacherMutation.isPending ||
    updateTeacherMutation.isPending ||
    deleteTeacherMutation.isPending;

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
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Teacher Management
                </h2>
                <p className="text-slate-600 mt-1">
                  Easily manage teachers of the system
                </p>
              </div>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
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

          {/* Add Teacher Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <UserPlus className="mr-2 text-purple-600" />
              Add New Teacher
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
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    {...register("department", {
                      required: "Department is required",
                    })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Teaching Courses
                  </label>
                  <div className="relative">
                    {/* Selected courses tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedCourses.map((courseId) => {
                        const course = courses.find((c) => c.id === courseId);
                        return course ? (
                          <span
                            key={course.id}
                            className="inline-flex items-center bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                          >
                            {course.courseCode}
                            <button
                              type="button"
                              onClick={() => handleCourseSelect(course.id)}
                              className="ml-1 text-purple-600 hover:text-purple-800"
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
                      {...register("teachingCourseIds", {
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
                      className="w-full p-3 border border-slate-300 rounded-lg bg-white text-left flex items-center justify-between hover:bg-slate-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                  ? "bg-purple-50 border-l-4 border-purple-500"
                                  : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedCourses.includes(course.id)}
                                onChange={() => {}} // Handled by parent div click
                                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
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
                  {errors.teachingCourseIds && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.teachingCourseIds.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("passwordHash", {
                      required: "Password is required",
                    })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.passwordHash && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.passwordHash.message}
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
                      ? "bg-purple-400"
                      : "bg-purple-600 hover:bg-purple-700"
                  } text-white px-4 py-2 rounded-lg transition-colors flex items-center`}
                >
                  {isSubmitting ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? "Adding..." : "Add Teacher"}
                </button>
              </div>
            </form>
          </div>

          {/* Teachers List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <Users className="mr-2 text-purple-600" />
              Registered Teachers
            </h2>

            {/* Loading indicator - only show on initial load */}
            {isLoading && teachers.length === 0 && (
              <div className="flex justify-center items-center py-8">
                <Loader className="w-8 h-8 text-purple-600 animate-spin" />
                <span className="ml-2 text-slate-600">Loading teachers...</span>
              </div>
            )}

            {/* Error display */}
            {!isLoading && error && teachers.length === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && teachers.length === 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  No teachers registered yet
                </h3>
                <p className="text-slate-600">
                  Add your first teacher using the form above
                </p>
              </div>
            )}

            {/* Teachers table - only show when data is available */}
            {teachers.length > 0 && (
              <div className="overflow-x-auto">
                {/* If we're refreshing data but already have items, show a small indicator */}
                {isLoading && teachers.length > 0 && (
                  <div className="text-sm text-slate-500 flex items-center justify-end mb-2">
                    <Loader className="w-4 h-4 mr-2 text-purple-600 animate-spin" />
                    Refreshing...
                  </div>
                )}

                <table className="w-full border-collapse">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-slate-700">
                        Teacher ID
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-slate-700">
                        Name
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-slate-700">
                        Email
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-slate-700">
                        Department
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-slate-700">
                        Teaching Courses
                      </th>
                      <th className="p-3 text-left text-sm font-medium text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-slate-50">
                        <td className="p-3 text-sm text-slate-800 font-medium">
                          {teacher.teacherId || teacher.id}
                        </td>
                        <td className="p-3 text-sm text-slate-800">
                          {editingIndex === teacher.id ? (
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
                                {teacher.firstName} {teacher.lastName}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {editingIndex === teacher.id ? (
                            <input
                              {...registerEdit("email", { required: true })}
                              className="p-1 border border-slate-300 rounded-lg text-sm w-full"
                            />
                          ) : (
                            teacher.email
                          )}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {editingIndex === teacher.id ? (
                            <input
                              {...registerEdit("department", {
                                required: true,
                              })}
                              className="p-1 border border-slate-300 rounded-lg text-sm"
                              placeholder="Department"
                            />
                          ) : (
                            teacher.department
                          )}
                        </td>
                        <td className="p-3 text-sm text-slate-600">
                          {editingIndex === teacher.id ? (
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
                                      className="inline-flex items-center bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                                    >
                                      {course.courseCode}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleEditCourseSelect(course.id)
                                        }
                                        className="ml-1 text-purple-600 hover:text-purple-800"
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
                                {...registerEdit("teachingCourseIds", {
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
                                        ? "bg-purple-50"
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
                              {teacher.teachingCourses ? (
                                // If teachingCourses is available (direct from API)
                                teacher.teachingCourses.map((course) => (
                                  <span
                                    key={course.id}
                                    className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {course.courseCode}
                                  </span>
                                ))
                              ) : Array.isArray(teacher.teachingCourseIds) &&
                                teacher.teachingCourseIds.length > 0 ? (
                                // If we need to use teachingCourseIds and map to courses
                                courses
                                  .filter((course) => {
                                    const courseId =
                                      typeof course.id === "string"
                                        ? parseInt(course.id, 10)
                                        : course.id;

                                    return teacher.teachingCourseIds.some(
                                      (id) => {
                                        const teacherCourseId =
                                          typeof id === "string"
                                            ? parseInt(id, 10)
                                            : id;
                                        return courseId === teacherCourseId;
                                      }
                                    );
                                  })
                                  .map((course) => (
                                    <span
                                      key={course.id}
                                      className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                                    >
                                      {course.courseCode}
                                    </span>
                                  ))
                              ) : (
                                <span className="text-slate-400">
                                  No courses assigned
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {editingIndex === teacher.id ? (
                            <div className="flex space-x-2">
                              <input
                                {...registerEdit("passwordHash")}
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
                                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
                                onClick={() => startEditing(teacher)}
                                disabled={isSubmitting}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                                onClick={() => handleDelete(teacher.id)}
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

export default ManageTeacherPage;
