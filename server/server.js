require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Groq } = require('groq-sdk');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.post('/api/query', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192",
    });

    res.json({ response: chatCompletion.choices[0]?.message?.content || 'No response' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Add this after all your routes
if (process.env.NODE_ENV === 'production') {
  // Serve static files from client build
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}