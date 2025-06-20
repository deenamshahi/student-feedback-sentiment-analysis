import React, { useState, useEffect } from 'react';
import '../CSS/StudentDashboard.css';
import Navbar from '../Components/Navbar';

const StudentDashboard = () => {
  const courses = ['CS101', 'ENG301', 'MATH201'];
  const teachers = ['Prof. Smith', 'Prof. Williams', 'Prof. Johnson'];

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [comments, setComments] = useState('');

  const questionsPerPage = 5;
  const maxWords = 100;

  useEffect(() => {
    const fetchedQuestions = [
      // Teacher-related
      "How clearly did the teacher explain the topics?",
      "Was the teacher respectful and approachable?",
      "How well did the teacher encourage student participation?",
      "Did the teacher use real-life examples to explain the subject?",
      "How punctual was the teacher in starting and ending classes?",
      "How effective was the teacher in managing the class?",
      "How open was the teacher to student questions and feedback?",
      "Did the teacher make learning enjoyable?",
      "How frequently did the teacher provide helpful feedback?",
      "How would you describe your overall experience with the teacher?",

      // Course-related
      "How well was the course content organized?",
      "Was the syllabus covered on time?",
      "How useful were the study materials (notes, slides, videos)?",
      "Were the assignments relevant and helpful for learning?",
      "Did the course improve your understanding of the subject?",
      "How engaging was the course throughout the semester?",
      "Was the course workload manageable?",
      "How satisfied were you with the overall course design?",
      "How practical or applicable was the course content?",
      "Would you recommend this course to other students?"
    ];
    setQuestions(fetchedQuestions);
  }, []);

  const options = [
    "Strongly Agree",
    "Agree",
    "Neutral",
    "Disagree",
    "Strongly Disagree"
  ];

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCourse || !selectedTeacher) {
      alert('Please select both a course and a teacher.');
      return;
    }

    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    alert('Feedback submitted!');
    console.log('Selected Course:', selectedCourse);
    console.log('Selected Teacher:', selectedTeacher);
    console.log('Answers:', answers);
    console.log('Additional Comments:', comments);
  };

  const handleCommentsChange = (e) => {
    const input = e.target.value;
    const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount <= maxWords) {
      setComments(input);
    }
  };

  const startIndex = currentPage * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));
  const currentPageNumber = currentPage + 1;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  return (
    <div className="student-dashboard-container">
      <div className="progress-fixed">
        <div className="progress-wrapper">
          <div className="progress-bar-text">{progressPercent}%</div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <Navbar />

      <div className="student-dashboard">
        <div className="welcome-box">
          <h2>Welcome back, Student!</h2>
          <p>Your feedback helps improve our educational experience. Share your thoughts anonymously and contribute to positive change.</p>
        </div>

        <div className="selector-box">
          <div className="selector-title">SELECT COURSE / TEACHER</div>
          <div className="selectors">
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">Select Course</option>
              {courses.map((course, idx) => (
                <option key={idx} value={course}>{course}</option>
              ))}
            </select>
            <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
              <option value="">Select Teacher</option>
              {teachers.map((inst, idx) => (
                <option key={idx} value={inst}>{inst}</option>
              ))}
            </select>
          </div>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>

          {currentQuestions.map((q, i) => {
            const questionIndex = startIndex + i;
            return (
              <div key={questionIndex} className="question-block">
                <p><strong>{questionIndex + 1}. {q}</strong></p>
                <div className="options">
                  {options.map((opt, j) => (
                    <label key={j}>
                      <input
                        type="radio"
                        name={`q${questionIndex}`}
                        value={opt}
                        checked={answers[questionIndex] === opt}
                        onChange={() => handleAnswerChange(questionIndex, opt)}
                        required
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="page-number">
            Page {currentPageNumber} of {totalPages}
          </div>

          {endIndex >= totalQuestions && (
            <div className="additional-comments-container">
              <label htmlFor="comments"><strong>Additional Comments (optional):</strong></label>
              <textarea
                id="comments"
                name="comments"
                placeholder="Share your suggestions or feedback..."
                rows="4"
                value={comments}
                onChange={handleCommentsChange}
              />
              <div className="char-limit">
                <small>
                  {comments.trim().split(/\s+/).filter(Boolean).length}/{maxWords} words
                </small>
                <small className="limit-label">limit</small>
              </div>
            </div>
          )}

          <div className="pagination-buttons">
            {currentPage > 0 && (
              <button type="button" onClick={() => setCurrentPage((prev) => prev - 1)}>
                Previous
              </button>
            )}
            {endIndex < totalQuestions && (
              <button type="button" onClick={() => setCurrentPage((prev) => prev + 1)}>
                Next
              </button>
            )}
          </div>

          {endIndex >= totalQuestions && (
            <button
              className="submit-btn"
              type="submit"
              disabled={progressPercent < 100}
              style={{
                cursor: progressPercent < 100 ? 'not-allowed' : 'pointer',
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                border: '1px solid #28a745'
              }}
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default StudentDashboard;
