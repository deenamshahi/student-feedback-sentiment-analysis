import React, { useState, useEffect } from 'react';
import '../CSS/StudentDashboard.css';
import Navbar from '../Components/Navbar';

const StudentDashboard = () => {
  const [courses] = useState(['CS101', 'ENG301', 'MATH201']);
  const [instructors] = useState(['Prof. Smith', 'Prof. Williams', 'Prof. Johnson']);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const questionsPerPage = 5;

  useEffect(() => {
    const fetchedQuestions = Array.from(
      { length: 20 },
      (_, i) => `Question ${i + 1}: How do you rate this aspect of the course?`
    );
    setQuestions(fetchedQuestions);
  }, []);

  const options = [
    "Very clearly", "Clearly", "Somewhat clearly", "Not clearly", "Not at all"
  ];

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Feedback submitted!');
  };

  const startIndex = currentPage * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));

  return (
    <div className="student-dashboard-container">
      <div className="progress-fixed">
        <div className="progress-wrapper">
          <div className="progress-bar-text">{progressPercent}%</div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
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
          <div className="selector-title">SELECT COURSE / INSTRUCTOR</div>
          <div className="selectors">
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">Select Course</option>
              {courses.map((course, idx) => (
                <option key={idx} value={course}>{course}</option>
              ))}
            </select>
            <select value={selectedInstructor} onChange={(e) => setSelectedInstructor(e.target.value)}>
              <option value="">Select Instructor</option>
              {instructors.map((inst, idx) => (
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

          <div className="pagination-buttons">
            {currentPage > 0 && (
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
            )}
            {endIndex < totalQuestions && (
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            )}
          </div>

          {endIndex >= totalQuestions && (
            <button
              className="submit-btn"
              type="submit"
              disabled={progressPercent < 100}
              style={{ cursor: progressPercent < 100 ? 'not-allowed' : 'pointer',
                 backgroundColor: '#28a745', // Green example
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
