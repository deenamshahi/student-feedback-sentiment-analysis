import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../CSS/Form.css';

const CreateForm = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [questions, setQuestions] = useState([{ question: '', options: [''] }]);
  const [formType, setFormType] = useState('Teacher');
  const [targetName, setTargetName] = useState('');
  const [comments, setComments] = useState('');
  const maxWords = 100;

  // Static teacher and course data
  const teachers = [
    'Prof. Aayush Sharma',
    'Dr. Pratiksha Koirala',
    'Ms. Ritesh Gurung'
  ];

  const courses = [
    'Data Structures and Algorithms',
    'Engineering Mathematics',
    'Object-Oriented Programming'
  ];

  const optionsList = formType === 'Teacher' ? teachers : courses;

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push('');
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: [''] }]);
  };

  const handleCommentsChange = (e) => {
    const input = e.target.value;
    const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount <= maxWords) {
      setComments(input);
    }
  };

  const submitForm = () => {
    if (!targetName.trim()) {
      alert(`Please specify which ${formType.toLowerCase()} the feedback is for.`);
      return;
    }
    console.log('Form Type:', formType);
    console.log(`${formType} Name/Title:`, targetName);
    console.log('Submitted Form:', questions);
    console.log('Additional Comments:', comments);
    alert(`Feedback form for ${formType} "${targetName}" created successfully!`);
  };

  return (
    <div className="admin-dashboard">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <h1>Create Feedback Form</h1>

      <div className="form-type">
        <label>Form for:</label>
        <select value={formType} onChange={(e) => setFormType(e.target.value)}>
          <option value="Teacher">Teacher</option>
          <option value="Course">Course</option>
        </select>

        <select value={targetName} onChange={(e) => setTargetName(e.target.value)}>
          <option value="">{`Select ${formType}`}</option>
          {optionsList.map((item, idx) => (
            <option key={idx} value={item}>{item}</option>
          ))}
        </select>
      </div>

      <section className="create-form">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-block">
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            />
            {q.options.map((opt, oIndex) => (
              <input
                key={oIndex}
                type="text"
                placeholder={`Option ${oIndex + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
              />
            ))}
            <button type="button" onClick={() => addOption(qIndex)}>Add Option</button>
          </div>
        ))}

        <button type="button" onClick={addQuestion} className='add-question-btn'>Add Question</button>

        {/* Additional Comments Section */}
        <div className="additional-comments">
          <label htmlFor="comments">Additional Comments (optional)</label>
          <textarea
            id="comments"
            value={comments}
            onChange={handleCommentsChange}
            placeholder="Share your other thoughts or suggestions..."
          />
          <div className="word-count">
            {comments.trim().split(/\s+/).filter(Boolean).length} / {maxWords} words
          </div>
        </div>

        <button type="button" className="submit-btn" onClick={submitForm}>Create Form</button>
      </section>
    </div>
  );
};

export default CreateForm;
