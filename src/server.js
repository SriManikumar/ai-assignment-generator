const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');  
require("dotenv").config();  

const app = express();
const port = process.env.PORT || 5001;
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up the database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Your MySQL username
  password: 'Manigadu123$',  // Your MySQL password
  database: 'task_manager',
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL database');
});

// Route to save course material
app.post('/api/course', (req, res) => {
  const { title, content } = req.body;
  const query = 'INSERT INTO course_material (title, content) VALUES (?, ?)';
  db.query(query, [title, content], (err, result) => {
    if (err) {
      res.status(500).send({ message: '❌ Error saving course material.' });
    } else {
      res.status(200).send({ message: '✅ Course material saved successfully.' });
    }
  });
});

// Route to generate assignment questions using Google Gemini API

  
app.post('/api/generate', async (req, res) => {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const courseMaterial = req.body.courseMaterial;

    if (!geminiApiKey) {
      throw new Error("Gemini API key is missing!");
    }

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate 5 multiple-choice questions from the following course material:\n\n${courseMaterial}`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log("✅ Generated questions:", response.data);
    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const generatedQuestions = generatedText.split("\n").filter((q) => q.trim());

    res.status(200).json({ questions: generatedQuestions });
  } catch (error) {
    console.error("❌ Error generating questions:", error.response?.data || error.message || error);

    res.status(500).json({
      message: "Error generating questions.",
      error: error.response?.data || error.message || "Unknown error",
    });
  }
});
  
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
  