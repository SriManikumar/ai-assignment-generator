import React, { useState } from 'react';

import axios from 'axios';
import './App.css';
import logo from './logo.svg';

function App() {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseContent, setCourseContent] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save the course material in the backend
      await axios.post("http://localhost:5001/api/course", {
        title: courseTitle,
        content: courseContent,
      });
  
      // Call the backend to generate questions based on course content
      const response = await axios.post("http://localhost:5001/api/generate", {
        courseMaterial: courseContent,
      });
      console.log("Generated Questions:", response.data);
  
      // Store the generated questions in state
      setGeneratedQuestions(response.data.questions);  
    } catch (error) {
      if (error.response) {
        console.error("❌ Error:", error.response.data);
      }
      
      console.error("❌ Error generating assignment:", error);

    }
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>AI-Powered Assignment Generator</h1>
        <form onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="Course Title"
    value={courseTitle}
    onChange={(e) => setCourseTitle(e.target.value)}
    required
  />
  <textarea
    placeholder="Enter Course Content"
    value={courseContent}
    onChange={(e) => setCourseContent(e.target.value)}
    required
  />
  <button type="submit">Generate Assignment</button>
</form>


        <div>
          <h2>Generated Questions:</h2>
          <ul>
            {generatedQuestions.length > 0 ? (
              generatedQuestions.map((question, index) => (
                <li key={index}>{question}</li>
              ))
            ) : (
              <p>No questions generated yet.</p>
            )}
          </ul>
        </div>

        <p> <code></code> </p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;