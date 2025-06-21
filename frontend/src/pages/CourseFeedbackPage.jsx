import React, { useState } from "react";
import StudentSidebar from "../Components/StudentSidebar";
import {
  Users,
  BookOpen,
  GraduationCap,
  Send,
  AlertCircle,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxios from "../api/apiaxios";
import { toast } from "react-toastify";

const CourseFeedbackPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [additionalComments, setAdditionalComments] = useState("");
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const api = useAxios();

  const courseFeedbackQuestions = [
    {
      question: "How relevant is the course content to your academic goals?",
      options: [
        "Excellent - Highly relevant and valuable",
        "Good - Mostly relevant with clear benefits",
        "Average - Somewhat relevant to my goals",
        "Poor - Limited relevance to my studies",
        "Very Poor - Completely irrelevant and useless"
      ]
    },
    {
      question: "How would you rate the course difficulty level?",
      options: [
        "Perfect - Challenging but manageable",
        "Good - Appropriate difficulty level",
        "Average - Acceptable challenge level",
        "Poor - Too difficult or too easy",
        "Very Poor - Extremely inappropriate difficulty"
      ]
    },
    {
      question: "How well organized is the course structure?",
      options: [
        "Excellent - Very well structured and logical",
        "Good - Well organized with clear flow",
        "Average - Adequately structured overall",
        "Poor - Poorly organized and confusing",
        "Very Poor - Completely disorganized and chaotic"
      ]
    },
    {
      question: "How helpful are the course materials and resources?",
      options: [
        "Excellent - Very comprehensive and useful",
        "Good - Helpful with adequate coverage",
        "Average - Sufficient for basic understanding",
        "Poor - Limited and not very helpful",
        "Very Poor - Inadequate and completely unhelpful"
      ]
    },
    {
      question: "How fair and appropriate are the assignments and exams?",
      options: [
        "Excellent - Very fair and well-designed",
        "Good - Generally fair with good assessment",
        "Average - Adequately fair most of the time",
        "Poor - Often unfair or poorly designed",
        "Very Poor - Consistently unfair and terrible"
      ]
    },
    {
      question: "Overall, how satisfied are you with this course?",
      options: [
        "Extremely Satisfied - Outstanding course",
        "Very Satisfied - Great learning experience",
        "Satisfied - Good overall course",
        "Dissatisfied - Poor course experience",
        "Very Dissatisfied - Terrible course"
      ]
    }
  ];

  // Fetch user's enrolled courses
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
      toast.error("Failed to load your courses");
    },
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation({
    mutationFn: async (feedbackData) => {
      const response = await api.post(`/api/feedback/course/${selectedCourse}`, feedbackData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Course feedback submitted successfully!");
      // Reset form
      setSelectedCourse("");
      setSelectedAnswers({});
      setAdditionalComments("");
    },
    onError: (error) => {
      console.error("Error submitting feedback:", error);
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    },
  });

  const enrolledCourses = userData?.enrolledCourses || [];

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const formatFeedbackText = () => {
    const selectedCourseData = enrolledCourses.find(course => course.id === selectedCourse);
    let feedbackText = `Course Feedback for ${selectedCourseData?.courseName} (${selectedCourseData?.courseCode})\n\n`;
    
    // Add all question-answer pairs
    courseFeedbackQuestions.forEach((question, index) => {
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
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    const unansweredQuestions = courseFeedbackQuestions.filter(
      (_, index) => !selectedAnswers[index]
    );

    if (unansweredQuestions.length > 0) {
      toast.error("Please answer all questions");
      return;
    }

    // Prepare feedback data for AI model
    const feedbackData = {
      feedback: formatFeedbackText()
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
          <p className="text-slate-600 font-medium">Loading courses...</p>
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
            Unable to Load Courses
          </h2>
          <p className="text-slate-600 mb-4">
            {userError.response?.data?.message ||
              "There was an error loading your courses."}
          </p>
        </div>
      </div>
    );
  }

  const selectedCourseData = enrolledCourses.find(course => course.id === selectedCourse);

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
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Course Feedback
                </h2>
                <p className="text-slate-600 mt-1">
                  Share your thoughts about the course to help us improve
                </p>
              </div>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>

          {/* Course Selection */}
          <section className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-800">
                  Select Course
                </h3>
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Choose the course you want to provide feedback for:
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
                  >
                    <span className={selectedCourse ? "text-slate-800" : "text-slate-500"}>
                      {selectedCourseData 
                        ? `${selectedCourseData.courseCode} - ${selectedCourseData.courseName}`
                        : "Select a course"
                      }
                    </span>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </button>

                  {showCourseDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                      {enrolledCourses.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">
                          No courses available
                        </div>
                      ) : (
                        enrolledCourses.map((course) => (
                          <button
                            key={course.id}
                            onClick={() => {
                              setSelectedCourse(course.id);
                              setShowCourseDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 border-b border-slate-100 last:border-b-0"
                          >
                            <div className="font-medium text-slate-800">
                              {course.courseCode}
                            </div>
                            <div className="text-sm text-slate-600">
                              {course.courseName}
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
          {selectedCourse && (
            <section className="mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="flex items-center space-x-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-800">
                    Feedback Questions
                  </h3>
                </div>

                <div className="space-y-8">
                  {courseFeedbackQuestions.map((q, questionIndex) => (
                    <div key={questionIndex} className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                      <h4 className="text-lg font-semibold text-slate-800 mb-4">
                        {questionIndex + 1}. {q.question}
                      </h4>
                      
                      <div className="space-y-3">
                        {q.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`question-${questionIndex}`}
                              value={option}
                              checked={selectedAnswers[questionIndex] === option}
                              onChange={() => handleAnswerSelect(questionIndex, option)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-slate-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Comments */}
                <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl border border-slate-200">
                  <h4 className="text-lg font-semibold text-slate-800 mb-4">
                    Additional Comments (Optional)
                  </h4>
                  <textarea
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    placeholder="Share any additional thoughts about the course..."
                    rows="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={submitFeedbackMutation.isPending}
                    className={`flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl ${
                      submitFeedbackMutation.isPending ? 'opacity-75 cursor-not-allowed' : ''
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

          {/* No Course Selected Message */}
          {!selectedCourse && (
            <section>
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200 text-center">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Select a Course
                </h3>
                <p className="text-slate-600">
                  Please select a course from the dropdown above to start providing feedback
                </p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseFeedbackPage;