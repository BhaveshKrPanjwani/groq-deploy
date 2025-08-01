require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
const path = require('path');

// Validate environment first
if (!process.env.GROQ_API_KEY) {
  console.error('ERROR: Missing GROQ_API_KEY in environment variables');
  process.exit(1); // Crash immediately if no API key
}

const app = express();
const port = process.env.PORT || 5000;

// Enhanced CORS for production
// Replace your current CORS middleware with this:
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://groq-chat-frontend.vercel.app' // Your future frontend URL
  ]
}));

app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// API endpoint with better error handling
app.post('/api/query', async (req, res) => {
  try {
    if (!req.body.prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: req.body.prompt }],
      model: "llama3-70b-8192",
    });

    res.json({ 
      response: chatCompletion.choices[0]?.message?.content || 'No response',
      model: chatCompletion.model // For debugging
    });
  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process query',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Production static files (must be AFTER API routes)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});