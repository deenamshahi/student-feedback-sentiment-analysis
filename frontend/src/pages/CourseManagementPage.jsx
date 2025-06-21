import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
  Users, 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X 
} from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import useAxios from '../api/apiaxios';

const CourseManagementPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const api = useAxios();
  const queryClient = useQueryClient();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // TanStack Query for fetching courses
  const {
    data: courses = [],
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await api.get('/api/courses');
      return response.data.data;
    },
    onError: (error) => {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    },
  });

  // Add course mutation
  const addCourseMutation = useMutation({
    mutationFn: async (courseData) => {
      const response = await api.post('/api/courses', courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      toast.success('Course added successfully!');
      reset();
    },
    onError: (error) => {
      console.error('Error adding course:', error);
      toast.error(error.response?.data?.message || 'Failed to add course');
    },
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, courseData }) => {
      const response = await api.put(`/api/courses/${id}`, courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      toast.success('Course updated successfully!');
      cancelEditing();
    },
    onError: (error) => {
      console.error('Error updating course:', error);
      toast.error(error.response?.data?.message || 'Failed to update course');
    },
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/api/courses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      toast.success('Course deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting course:', error);
      toast.error(error.response?.data?.message || 'Failed to delete course');
    },
  });

  // React Hook Form for adding new courses
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseCode: "",
      courseName: "",
      description: "",
    },
  });

  // React Hook Form for editing existing courses
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: editErrors },
  } = useForm({
    defaultValues: {
      courseCode: "",
      courseName: "",
      description: "",
    },
  });

  // Add new course handler
  const onSubmit = async (data) => {
    try {
      await addCourseMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error submitting course:', error);
    }
  };

  // Delete course handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this course? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      try {
        await deleteCourseMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  // Start editing course handler
  const startEditing = (course) => {
    setEditingIndex(course.id);
    setValueEdit('courseCode', course.courseCode);
    setValueEdit('courseName', course.courseName);
    setValueEdit('description', course.description);
  };

  // Cancel editing handler
  const cancelEditing = () => {
    setEditingIndex(null);
    resetEdit();
  };

  // Submit edit form handler
  const onEditSubmit = async (data) => {
    try {
      await updateCourseMutation.mutateAsync({ 
        id: editingIndex, 
        courseData: data 
      });
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  // Loading and error states
  const isLoading = coursesLoading;
  const error = coursesError;
  const isSubmitting =
    addCourseMutation.isPending ||
    updateCourseMutation.isPending ||
    deleteCourseMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-red-100 rounded-full mx-auto mb-4 w-fit">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-medium">Error loading courses: {error.message}</p>
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
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Course Management</h2>
                <p className="text-slate-600 mt-1">Add, edit, and manage courses in the system</p>
              </div>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>

          {/* Add Course Form */}
          <section className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <Plus className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-800">Add New Course</h3>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Course Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Course Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('courseCode', {
                      required: 'Course code is required',
                      minLength: {
                        value: 2,
                        message: 'Course code must be at least 2 characters'
                      }
                    })}
                    type="text"
                    placeholder="e.g., CS101"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.courseCode 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.courseCode && (
                    <p className="text-red-600 text-sm">{errors.courseCode.message}</p>
                  )}
                </div>

                {/* Course Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('courseName', {
                      required: 'Course name is required',
                      minLength: {
                        value: 2,
                        message: 'Course name must be at least 2 characters'
                      }
                    })}
                    type="text"
                    placeholder="e.g., Introduction to Computer Science"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      errors.courseName 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.courseName && (
                    <p className="text-red-600 text-sm">{errors.courseName.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <label className="text-sm font-medium text-slate-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('description', {
                      required: 'Description is required',
                      minLength: {
                        value: 10,
                        message: 'Description must be at least 10 characters'
                      }
                    })}
                    placeholder="Course description..."
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 resize-none ${
                      errors.description 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm">{errors.description.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 lg:col-span-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding Course...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Add Course</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Courses List */}
          <section>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-800">All Courses</h3>
                </div>
                <div className="text-sm text-slate-500">
                  Total: {courses.length} courses
                </div>
              </div>

              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No courses found</p>
                  <p className="text-sm text-slate-400">Add your first course using the form above</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Course Code</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Course Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Description</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course, index) => (
                        <tr key={course.id} className="border-b border-slate-100 hover:bg-slate-50">
                          {editingIndex === course.id ? (
                            <>
                              {/* Edit Mode */}
                              <td className="py-4 px-4">
                                <input
                                  {...registerEdit('courseCode', {
                                    required: 'Course code is required',
                                    minLength: {
                                      value: 2,
                                      message: 'Course code must be at least 2 characters'
                                    }
                                  })}
                                  type="text"
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                                    editErrors.courseCode 
                                      ? 'border-red-300 focus:ring-red-500' 
                                      : 'border-slate-300 focus:ring-blue-500'
                                  }`}
                                />
                                {editErrors.courseCode && (
                                  <p className="text-red-600 text-xs mt-1">{editErrors.courseCode.message}</p>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <input
                                  {...registerEdit('courseName', {
                                    required: 'Course name is required',
                                    minLength: {
                                      value: 2,
                                      message: 'Course name must be at least 2 characters'
                                    }
                                  })}
                                  type="text"
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 ${
                                    editErrors.courseName 
                                      ? 'border-red-300 focus:ring-red-500' 
                                      : 'border-slate-300 focus:ring-blue-500'
                                  }`}
                                />
                                {editErrors.courseName && (
                                  <p className="text-red-600 text-xs mt-1">{editErrors.courseName.message}</p>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <textarea
                                  {...registerEdit('description', {
                                    required: 'Description is required',
                                    minLength: {
                                      value: 10,
                                      message: 'Description must be at least 10 characters'
                                    }
                                  })}
                                  rows="2"
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 resize-none ${
                                    editErrors.description 
                                      ? 'border-red-300 focus:ring-red-500' 
                                      : 'border-slate-300 focus:ring-blue-500'
                                  }`}
                                />
                                {editErrors.description && (
                                  <p className="text-red-600 text-xs mt-1">{editErrors.description.message}</p>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={handleSubmitEdit(onEditSubmit)}
                                    disabled={isSubmitting}
                                    className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                                  >
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    disabled={isSubmitting}
                                    className="flex items-center space-x-1 px-3 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors duration-200"
                                  >
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              {/* View Mode */}
                              <td className="py-4 px-4">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                  {course.courseCode}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-medium text-slate-800">{course.courseName}</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-slate-600 text-sm max-w-xs truncate">
                                  {course.description}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => startEditing(course)}
                                    disabled={isSubmitting}
                                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                  >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(course.id)}
                                    disabled={isSubmitting}
                                    className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CourseManagementPage;