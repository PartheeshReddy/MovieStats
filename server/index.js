// Minimal Express proxy to keep API keys on server-side
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_KEY = process.env.TMDB_API_KEY; // set in .env on server

if (!TMDB_KEY) {
  console.warn('Warning: TMDB_API_KEY not set in environment. Set TMDB_API_KEY in your .env before starting the server.');
}

app.get('/api/tmdb/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const page = req.query.page || 1;
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}&page=${page}`);
    const json = await response.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
