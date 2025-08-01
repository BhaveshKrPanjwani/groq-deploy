import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
// Use this dynamic URL logic:
// Use this dynamic URL logic:
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api/query' 
  : 'https://groq-api-backend.vercel.app/api/query';
  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await axios.post(API_URL, { prompt }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    setResponse(res.data.response);
  } catch (error) {
    setResponse(`Error: ${error.response?.data?.error || error.message}`);
    console.error('API Error:', {
      config: error.config,
      response: error.response?.data
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="App">
      <header className="App-header">
        <h1>Groq API Query</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            rows={5}
            cols={50}
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
        {response && (
          <div className="response">
            <h2>Response:</h2>
            <p>{response}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;