// API service for movie data fetching and caching

class MovieAPI {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = new Map();
    }

    // Generic API request method with caching
    async makeRequest(url, useCache = true) {
        const cacheKey = url;
        
        // Check cache first
        if (useCache && this.isCacheValid(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cache the response
            if (useCache) {
                this.cache.set(cacheKey, data);
                this.cacheExpiry.set(cacheKey, Date.now() + CONFIG.APP.CACHE_DURATION);
            }
            
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Check if cache is still valid
    isCacheValid(key) {
        const expiry = this.cacheExpiry.get(key);
        return expiry && Date.now() < expiry;
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        this.cacheExpiry.clear();
    }

    // TMDb API methods
    async searchMovies(query, page = 1) {
        const url = `${CONFIG.TMDB.BASE_URL}/search/movie?api_key=${CONFIG.TMDB.API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
        return this.makeRequest(url);
    }

    async searchPeople(query, page = 1) {
        const url = `${CONFIG.TMDB.BASE_URL}/search/person?api_key=${CONFIG.TMDB.API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
        return this.makeRequest(url);
    }

    async getTrendingMovies(timeWindow = 'week', page = 1) {
        const url = `${CONFIG.TMDB.BASE_URL}/trending/movie/${timeWindow}?api_key=${CONFIG.TMDB.API_KEY}&page=${page}`;
        return this.makeRequest(url);
    }

    async getTopRatedMovies(page = 1) {
        const url = `${CONFIG.TMDB.BASE_URL}/movie/top_rated?api_key=${CONFIG.TMDB.API_KEY}&page=${page}`;
        return this.makeRequest(url);
    }

    async getPopularMovies(page = 1) {
        const url = `${CONFIG.TMDB.BASE_URL}/movie/popular?api_key=${CONFIG.TMDB.API_KEY}&page=${page}`;
        return this.makeRequest(url);
    }

    async getMovieDetails(movieId) {
        const url = `${CONFIG.TMDB.BASE_URL}/movie/${movieId}?api_key=${CONFIG.TMDB.API_KEY}&append_to_response=credits,reviews,similar,videos`;
        return this.makeRequest(url);
    }

    async getMovieCredits(movieId) {
        const url = `${CONFIG.TMDB.BASE_URL}/movie/${movieId}/credits?api_key=${CONFIG.TMDB.API_KEY}`;
        return this.makeRequest(url);
    }

    async getMovieReviews(movieId, page = 1) {
        const url = `${CONFIG.TMDB.BASE_URL}/movie/${movieId}/reviews?api_key=${CONFIG.TMDB.API_KEY}&page=${page}`;
        return this.makeRequest(url);
    }

    async getSimilarMovies(movieId, page = 1) {
        const url = `${CONFIG.TMDB.BASE_URL}/movie/${movieId}/similar?api_key=${CONFIG.TMDB.API_KEY}&page=${page}`;
        return this.makeRequest(url);
    }

    async getGenres() {
        const url = `${CONFIG.TMDB.BASE_URL}/genre/movie/list?api_key=${CONFIG.TMDB.API_KEY}`;
        return this.makeRequest(url);
    }

    async getPersonDetails(personId) {
        const url = `${CONFIG.TMDB.BASE_URL}/person/${personId}?api_key=${CONFIG.TMDB.API_KEY}&append_to_response=movie_credits`;
        return this.makeRequest(url);
    }

    // Discover movies with filters
    async discoverMovies(filters = {}) {
        const params = new URLSearchParams({
            api_key: CONFIG.TMDB.API_KEY,
            ...filters
        });
        const url = `${CONFIG.TMDB.BASE_URL}/discover/movie?${params}`;
        return this.makeRequest(url);
    }

    // OMDb API methods (backup)
    async getOMDbMovieData(imdbId) {
        if (CONFIG.OMDB.API_KEY === 'YOUR_OMDB_API_KEY_HERE') {
            throw new Error(CONFIG.ERRORS.API_KEY_MISSING);
        }
        const url = `${CONFIG.OMDB.BASE_URL}?apikey=${CONFIG.OMDB.API_KEY}&i=${imdbId}&plot=full`;
        return this.makeRequest(url);
    }

    // Utility methods
    getImageUrl(path, size = 'POSTER') {
        if (!path) return null;
        return `${CONFIG.TMDB.IMAGE_BASE_URL}${CONFIG.TMDB.IMAGE_SIZES[size]}${path}`;
    }

    formatMovieData(movie) {
        return {
            id: movie.id,
            title: movie.title,
            originalTitle: movie.original_title,
            overview: movie.overview,
            releaseDate: movie.release_date,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
            rating: movie.vote_average,
            voteCount: movie.vote_count,
            popularity: movie.popularity,
            posterPath: movie.poster_path,
            backdropPath: movie.backdrop_path,
            genreIds: movie.genre_ids || [],
            genres: movie.genre_ids ? movie.genre_ids.map(id => CONFIG.GENRES[id]).filter(Boolean) : [],
            adult: movie.adult,
            originalLanguage: movie.original_language
        };
    }

    formatPersonData(person) {
        return {
            id: person.id,
            name: person.name,
            knownFor: person.known_for || [],
            profilePath: person.profile_path,
            popularity: person.popularity,
            adult: person.adult
        };
    }

    // Search with combined results (movies and people)
    async combinedSearch(query, page = 1) {
        try {
            const [moviesResult, peopleResult] = await Promise.all([
                this.searchMovies(query, page),
                this.searchPeople(query, page)
            ]);

            return {
                movies: moviesResult.results.map(movie => this.formatMovieData(movie)),
                people: peopleResult.results.map(person => this.formatPersonData(person)),
                totalPages: Math.max(moviesResult.total_pages, peopleResult.total_pages),
                totalResults: moviesResult.total_results + peopleResult.total_results
            };
        } catch (error) {
            console.error('Combined search failed:', error);
            throw error;
        }
    }

    // Get movie statistics for analytics
    async getMovieStatistics() {
        try {
            const [trending, topRated, popular] = await Promise.all([
                this.getTrendingMovies('week', 1),
                this.getTopRatedMovies(1),
                this.getPopularMovies(1)
            ]);

            return {
                trending: trending.results.map(movie => this.formatMovieData(movie)),
                topRated: topRated.results.map(movie => this.formatMovieData(movie)),
                popular: popular.results.map(movie => this.formatMovieData(movie))
            };
        } catch (error) {
            console.error('Failed to get movie statistics:', error);
            throw error;
        }
    }

    // Error handling
    handleAPIError(error) {
        let message = CONFIG.ERRORS.NETWORK_ERROR;
        
        if (error.message.includes('401')) {
            message = CONFIG.ERRORS.UNAUTHORIZED;
        } else if (error.message.includes('404')) {
            message = CONFIG.ERRORS.MOVIE_NOT_FOUND;
        } else if (error.message.includes('429')) {
            message = CONFIG.ERRORS.RATE_LIMIT_EXCEEDED;
        } else if (error.message.includes('Invalid')) {
            message = CONFIG.ERRORS.INVALID_RESPONSE;
        }

        return message;
    }
}

// Create global API instance
const movieAPI = new MovieAPI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MovieAPI;
}
