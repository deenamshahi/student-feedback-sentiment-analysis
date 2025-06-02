import React, { useState, useEffect } from 'react';
import '../CSS/StudentDashboard.css';

const StudentDashboard = () => {
  const [courses, setCourses] = useState(['CS101', 'ENG301', 'MATH201']);
  const [instructors, setInstructors] = useState(['Prof. Smith', 'Prof. Williams', 'Prof. Johnson']);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [questions, setQuestions] = useState([]);
  

  useEffect(() => {
    // Simulated fetch – later replace with actual API call
    const fetchedQuestions = [
      "How clearly does the teacher explain the subject matter?",
      "How well does the teacher prepare for the class?",
      "How effectively does the teacher use examples to explain concepts?",
      "How engaging is the teacher’s teaching style?",
      "How well does the teacher encourage class participation?",
      "How respectful is the teacher towards students?",
      "How well does the teacher manage classroom discipline?"
    ];
    setQuestions(fetchedQuestions);
  }, []);

  const options = [
    "Very clearly", "Clearly", "Somewhat clearly", "Not clearly", "Not at all"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submission logic placeholder
    alert('Feedback submitted!');
  };

  return (
    <div className="student-dashboard-container">
      <header className="student-header">
        <div className="logo">SFA</div>
        <div className="logout"><button>Logout</button></div>
      </header>
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
            {courses.map((course, idx) => <option key={idx} value={course}>{course}</option>)}
          </select>
          <select value={selectedInstructor} onChange={(e) => setSelectedInstructor(e.target.value)}>
            <option value="">Select Instructor</option>
            {instructors.map((inst, idx) => <option key={idx} value={inst}>{inst}</option>)}
          </select>
        </div>
      </div>

      <form className="feedback-form" onSubmit={handleSubmit}>
        {questions.map((q, i) => (
          <div key={i} className="question-block">
            <p><strong>{i + 1}. {q}</strong></p>
            <div className="options">
              {options.map((opt, j) => (
                <label key={j}>
                  <input type="radio" name={`q${i}`} value={opt} required />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button className="submit-btn" type="submit">Submit</button>
      </form>
    </div>
    </div>
  );
};

export default StudentDashboard;
