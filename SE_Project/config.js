// Safe configuration loader for MovieStats
// This file will use a runtime-provided configuration object if available.
// Do NOT put real API keys here. Create SE_Project/config.local.js (gitignored) or set window.MOVIE_STATS_CONFIG before this script runs.

(function(global){
  'use strict';

  // Default placeholder configuration (no real API keys)
  const DEFAULT_CONFIG = {
    TMDB: {
      API_KEY: 'REPLACE_ME',
      BASE_URL: 'https://api.themoviedb.org/3',
      IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
      IMAGE_SIZES: { POSTER: '/w500', BACKDROP: '/w1280', PROFILE: '/w185' }
    },
    OMDB: {
      API_KEY: 'REPLACE_ME',
      BASE_URL: 'http://www.omdbapi.com/'
    },
    APP: { ITEMS_PER_PAGE: 20, MAX_TRENDING_ITEMS: 20, MAX_SEARCH_RESULTS: 100, CACHE_DURATION: 300000, DEBOUNCE_DELAY: 500 },
    CHARTS: { COLORS: { PRIMARY: '#667eea', SECONDARY: '#ff6b6b', SUCCESS: '#4ecdc4', WARNING: '#ffd700', DANGER: '#ff5252', INFO: '#42a5f5', LIGHT: '#f8f9fa', DARK: '#333' }, OPTIONS: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } } },
    STORAGE: { USER_DATA: 'movieStats_userData', FAVORITES: 'movieStats_favorites', SEARCH_HISTORY: 'movieStats_searchHistory', THEME: 'movieStats_theme', API_CACHE: 'movieStats_apiCache' },
    GENRES: { 28: 'Action',12: 'Adventure',16: 'Animation',35: 'Comedy',80: 'Crime',99: 'Documentary',18: 'Drama',10751: 'Family',14: 'Fantasy',36: 'History',27: 'Horror',10402: 'Music',9648: 'Mystery',10749: 'Romance',878: 'Science Fiction',10770: 'TV Movie',53: 'Thriller',10752: 'War',37: 'Western' },
    RATING_SYSTEMS: { TMDB: 'TMDB Rating', IMDB: 'IMDB Rating', ROTTEN: 'Rotten Tomatoes', METACRITIC: 'Metacritic' },
    ERRORS: { API_KEY_MISSING: 'API key is missing. Please configure your API keys in SE_Project/config.local.js', NETWORK_ERROR: 'Network error. Please check your internet connection.', MOVIE_NOT_FOUND: 'Movie not found. Please try a different search term.', INVALID_RESPONSE: 'Invalid response from the server.', RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.', UNAUTHORIZED: 'Unauthorized access. Please check your API key.' },
    SUCCESS: { FAVORITE_ADDED: 'Movie added to favorites!', FAVORITE_REMOVED: 'Movie removed from favorites!', FEEDBACK_SUBMITTED: 'Thank you for your feedback!', DATA_EXPORTED: 'Data exported successfully!' }
  };

  // Use window.MOVIE_STATS_CONFIG if set by a local config file (SE_Project/config.local.js should set this), otherwise fallback to DEFAULT_CONFIG
  var CONFIG = (typeof window !== 'undefined' && window.MOVIE_STATS_CONFIG) ? window.MOVIE_STATS_CONFIG : DEFAULT_CONFIG;

  // Small helper: initialize year filter (kept from original implementation)
  function initializeYearFilter() {
    const yearFilter = typeof document !== 'undefined' && document.getElementById('yearFilter');
    if (yearFilter) {
      const currentYear = new Date().getFullYear();
      for (let year = currentYear; year >= 1950; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
      }
    }
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
      initializeYearFilter();

      if (CONFIG.TMDB.API_KEY === 'REPLACE_ME' || !CONFIG.TMDB.API_KEY) {
        console.warn('TMDb API key not configured. Please add your API key in SE_Project/config.local.js or set window.MOVIE_STATS_CONFIG before config.js runs.');
      }

      if (CONFIG.OMDB.API_KEY === 'REPLACE_ME' || !CONFIG.OMDB.API_KEY) {
        console.warn('OMDb API key not configured. Please add your API key in SE_Project/config.local.js or set window.MOVIE_STATS_CONFIG before config.js runs.');
      }
    });
  }

  // Expose CONFIG
  if (typeof global !== 'undefined') global.CONFIG = CONFIG;
  if (typeof module !== 'undefined' && module.exports) module.exports = CONFIG;
})(this);
