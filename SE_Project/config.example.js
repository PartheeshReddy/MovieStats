// Configuration template for MovieStats — DO NOT commit real API keys to the repository

const CONFIG = {
    // TMDb API Configuration
    TMDB: {
        API_KEY: 'YOUR_TMDB_API_KEY', // Replace with your actual API key
        BASE_URL: 'https://api.themoviedb.org/3',
        IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
        IMAGE_SIZES: {
            POSTER: '/w500',
            BACKDROP: '/w1280',
            PROFILE: '/w185'
        }
    },
    
    // OMDb API Configuration (backup)
    OMDB: {
        API_KEY: 'YOUR_OMDB_API_KEY', // Replace with your actual API key
        BASE_URL: 'http://www.omdbapi.com/'
    },
    
    // Application Settings
    APP: {
        ITEMS_PER_PAGE: 20,
        MAX_TRENDING_ITEMS: 20,
        MAX_SEARCH_RESULTS: 100,
        CACHE_DURATION: 300000, // 5 minutes in milliseconds
        DEBOUNCE_DELAY: 500 // Search debounce delay in milliseconds
    },
    
    // Chart Configuration
    CHARTS: {
        COLORS: {
            PRIMARY: '#667eea',
            SECONDARY: '#ff6b6b',
            SUCCESS: '#4ecdc4',
            WARNING: '#ffd700',
            DANGER: '#ff5252',
            INFO: '#42a5f5',
            LIGHT: '#f8f9fa',
            DARK: '#333'
        },
        OPTIONS: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    },
    
    // Local Storage Keys
    STORAGE: {
        USER_DATA: 'movieStats_userData',
        FAVORITES: 'movieStats_favorites',
        SEARCH_HISTORY: 'movieStats_searchHistory',
        THEME: 'movieStats_theme',
        API_CACHE: 'movieStats_apiCache'
    },
    
    // Genres mapping
    GENRES: {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western'
    },
    
    // Rating systems
    RATING_SYSTEMS: {
        TMDB: 'TMDB Rating',
        IMDB: 'IMDB Rating',
        ROTTEN: 'Rotten Tomatoes',
        METACRITIC: 'Metacritic'
    },
    
    // Error Messages
    ERRORS: {
        API_KEY_MISSING: 'API key is missing. Please configure your API keys in config.local.js',
        NETWORK_ERROR: 'Network error. Please check your internet connection.',
        MOVIE_NOT_FOUND: 'Movie not found. Please try a different search term.',
        INVALID_RESPONSE: 'Invalid response from the server.',
        RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
        UNAUTHORIZED: 'Unauthorized access. Please check your API key.'
    },
    
    // Success Messages
    SUCCESS: {
        FAVORITE_ADDED: 'Movie added to favorites!',
        FAVORITE_REMOVED: 'Movie removed from favorites!',
        FEEDBACK_SUBMITTED: 'Thank you for your feedback!',
        DATA_EXPORTED: 'Data exported successfully!'
    }
};

// Export configuration for Node or bundlers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
