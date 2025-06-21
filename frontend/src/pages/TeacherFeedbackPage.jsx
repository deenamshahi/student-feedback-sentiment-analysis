import React, { useState } from "react";
import StudentSidebar from "../Components/StudentSidebar";
import {
  Users,
  User,
  GraduationCap,
  Send,
  AlertCircle,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxios from "../api/apiaxios";
import { toast } from "react-toastify";

const TeacherFeedbackPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [additionalComments, setAdditionalComments] = useState("");
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const api = useAxios();

  const teacherFeedbackQuestions = [
    {
      question: "How would you rate the teacher's explanation of concepts?",
      options: [
        "Excellent - Very clear and easy to understand",
        "Good - Mostly clear with minor confusion",
        "Average - Sometimes unclear but manageable",
        "Poor - Often confusing and hard to follow",
        "Very Poor - Extremely difficult to understand",
      ],
    },
    {
      question: "How responsive is the teacher to student questions?",
      options: [
        "Excellent - Always available and helpful",
        "Good - Usually responsive and supportive",
        "Average - Sometimes available when needed",
        "Poor - Rarely available or helpful",
        "Very Poor - Never available or dismissive",
      ],
    },
    {
      question: "How would you rate the teacher's teaching methodology?",
      options: [
        "Excellent - Very engaging and effective",
        "Good - Mostly engaging with good techniques",
        "Average - Standard teaching approach",
        "Poor - Boring and ineffective methods",
        "Very Poor - Extremely dull and unhelpful",
      ],
    },
    {
      question: "How fair and timely is the teacher's feedback on assignments?",
      options: [
        "Excellent - Always fair and prompt",
        "Good - Usually fair with reasonable timing",
        "Average - Sometimes delayed but adequate",
        "Poor - Often unfair or very late",
        "Very Poor - Consistently unfair and extremely delayed",
      ],
    },
    {
      question: "How well does the teacher maintain classroom discipline?",
      options: [
        "Excellent - Perfect classroom management",
        "Good - Well-controlled learning environment",
        "Average - Adequate control most of the time",
        "Poor - Frequent disruptions and chaos",
        "Very Poor - No control, constant disturbances",
      ],
    },
    {
      question: "Overall, how satisfied are you with this teacher?",
      options: [
        "Extremely Satisfied - Outstanding teacher",
        "Very Satisfied - Great teaching experience",
        "Satisfied - Good overall experience",
        "Dissatisfied - Poor teaching experience",
        "Very Dissatisfied - Terrible teacher",
      ],
    },
  ];

  // Fetch user's data to get teachers from enrolled courses
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await api.get("/users/me");
      return response.data.data;
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load your teachers");
    },
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedbackData) => {
      const response = await api.post(
        `/api/feedback/teacher/${selectedTeacher}`,
        feedbackData
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Teacher feedback submitted successfully!");
      // Reset form
      setSelectedTeacher("");
      setSelectedAnswers({});
      setAdditionalComments("");
    },
    onError: (error) => {
      console.error("Error submitting feedback:", error);
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    },
  });

  // Extract unique teachers from all enrolled courses
  const allTeachers =
    userData?.enrolledCourses?.reduce((teachers, course) => {
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
    }, []) || [];

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const formatFeedbackText = () => {
    const selectedTeacherData = allTeachers.find(
      (teacher) => teacher.id === selectedTeacher
    );
    let feedbackText = `Teacher Feedback for ${selectedTeacherData?.firstName} ${selectedTeacherData?.lastName} (${selectedTeacherData?.department})\n`;
    feedbackText += `Teaching Courses: ${selectedTeacherData?.courses
      ?.map((c) => c.courseCode)
      .join(", ")}\n\n`;

    // Add all question-answer pairs
    teacherFeedbackQuestions.forEach((question, index) => {
      const answer = selectedAnswers[index];
      if (answer) {
        feedbackText += `${question.question}\nAnswer: ${answer}\n\n`;
      }
    });

    // Add additional comments if provided
    if (additionalComments.trim()) {
      feedbackText += `Additional Comments:\n${additionalComments.trim()}`;
    }

    return feedbackText;
  };

  const handleSubmit = () => {
    // Validation
    if (!selectedTeacher) {
      toast.error("Please select a teacher");
      return;
    }

    const unansweredQuestions = teacherFeedbackQuestions.filter(
      (_, index) => !selectedAnswers[index]
    );

    if (unansweredQuestions.length > 0) {
      toast.error("Please answer all questions");
      return;
    }

    // Prepare feedback data for AI model
    const feedbackData = {
      feedback: formatFeedbackText(),
    };

    console.log("Submitting feedback data:", feedbackData);
    submitFeedbackMutation.mutate(feedbackData);
  };

  // Loading state
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading teachers...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Unable to Load Teachers
          </h2>
          <p className="text-slate-600 mb-4">
            {userError.response?.data?.message ||
              "There was an error loading your teachers."}
          </p>
        </div>
      </div>
    );
  }

  const selectedTeacherData = allTeachers.find(
    (teacher) => teacher.id === selectedTeacher
  );

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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Teacher Feedback
                </h2>
                <p className="text-slate-600 mt-1">
                  Share your thoughts about your teacher to help improve
                  education quality
                </p>
              </div>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
          </div>

          {/* Teacher Selection */}
          <section className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-800">
                  Select Teacher
                </h3>
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Choose the teacher you want to provide feedback for:
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowTeacherDropdown(!showTeacherDropdown)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
                  >
                    <span
                      className={
                        selectedTeacher ? "text-slate-800" : "text-slate-500"
                      }
                    >
                      {selectedTeacherData
                        ? `${selectedTeacherData.firstName} ${selectedTeacherData.lastName} - ${selectedTeacherData.department}`
                        : "Select a teacher"}
                    </span>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </button>

                  {showTeacherDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                      {allTeachers.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">
                          No teachers available
                        </div>
                      ) : (
                        allTeachers.map((teacher) => (
                          <button
                            key={teacher.id}
                            onClick={() => {
                              setSelectedTeacher(teacher.id);
                              setShowTeacherDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors duration-200 border-b border-slate-100 last:border-b-0"
                          >
                            <div className="font-medium text-slate-800">
                              {teacher.firstName} {teacher.lastName}
                            </div>
                            <div className="text-sm text-slate-600">
                              {teacher.department}
                            </div>
                            <div className="text-xs text-purple-600 mt-1">
                              Teaching:{" "}
                              {teacher.courses
                                ?.map((c) => c.courseCode)
                                .join(", ")}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Feedback Questions */}
          {selectedTeacher && (
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="flex items-center space-x-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-slate-800">
                    Feedback Questions
                  </h3>
                </div>

                <div className="space-y-8">
                  {teacherFeedbackQuestions.map((q, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="p-6 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl border border-slate-200"
                    >
                      <h4 className="text-lg font-semibold text-slate-800 mb-4">
                        {questionIndex + 1}. {q.question}
                      </h4>

                      <div className="space-y-3">
                        {q.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`question-${questionIndex}`}
                              value={option}
                              checked={
                                selectedAnswers[questionIndex] === option
                              }
                              onChange={() =>
                                handleAnswerSelect(questionIndex, option)
                              }
                              className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                            />
                            <span className="text-slate-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Comments */}
                <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-pink-50 rounded-xl border border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">
                    Additional Comments (Optional)
                  </h4>
                  <textarea
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    placeholder="Share any additional thoughts about the teacher..."
                    rows="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={submitFeedbackMutation.isPending}
                    className={`flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl ${
                      submitFeedbackMutation.isPending
                        ? "opacity-75 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {submitFeedbackMutation.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* No Teacher Selected Message */}
          {!selectedTeacher && (
            <section>
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200 text-center">
                <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Select a Teacher
                </h3>
                <p className="text-slate-600">
                  Please select a teacher from the dropdown above to start
                  providing feedback
                </p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherFeedbackPage;
