// Main application logic and event handling

class MovieStatsApp {
    constructor() {
        this.currentPage = 1;
        this.currentQuery = '';
        this.searchResults = [];
        this.isSearching = false;
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('movieSearch');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }

        // Filter functionality
        const genreFilter = document.getElementById('genreFilter');
        const yearFilter = document.getElementById('yearFilter');
        const ratingFilter = document.getElementById('ratingFilter');

        [genreFilter, yearFilter, ratingFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.applyFilters());
            }
        });

        // Trending tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTrendingTab(e.target.dataset.tab));
        });

        // Movie comparison
        const compareBtn = document.getElementById('compareBtn');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.compareMovies());
        }

        // Feedback form
        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => this.handleFeedbackSubmit(e));
        }

        // Modal events
        this.setupModalEvents();

        // Navigation events
        this.setupNavigationEvents();
    }

    setupModalEvents() {
        const movieModal = document.getElementById('movieModal');
        const closeButtons = document.querySelectorAll('.close');

        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    setupNavigationEvents() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateToSection(targetId);
            });
        });

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-open');
            });
        }
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    async loadInitialData() {
        try {
            this.showLoadingSpinner();
            await this.loadTrendingMovies('trending');
            this.hideLoadingSpinner();
        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.hideLoadingSpinner();
            this.showError('Failed to load initial data');
        }
    }

    // Search functionality
    handleSearchInput(e) {
        const query = e.target.value.trim();
        this.currentQuery = query;

        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Debounce search
        if (query.length >= 2) {
            this.searchTimeout = setTimeout(() => {
                this.performSearch();
            }, CONFIG.APP.DEBOUNCE_DELAY);
        } else if (query.length === 0) {
            this.clearSearchResults();
        }
    }

    async performSearch() {
        if (this.isSearching || !this.currentQuery.trim()) return;

        this.isSearching = true;
        this.currentPage = 1;

        try {
            this.showLoadingSpinner();
            
            const results = await movieAPI.combinedSearch(this.currentQuery, this.currentPage);
            this.searchResults = results;
            
            this.displaySearchResults();
            this.navigateToSection('searchResults');
            
        } catch (error) {
            console.error('Search failed:', error);
            this.showError(movieAPI.handleAPIError(error));
        } finally {
            this.isSearching = false;
            this.hideLoadingSpinner();
        }
    }

    displaySearchResults() {
        const resultsContainer = document.getElementById('searchResultsGrid');
        const paginationContainer = document.getElementById('pagination');
        
        if (!resultsContainer) return;

        if (this.searchResults.movies.length === 0 && this.searchResults.people.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No results found for "${this.currentQuery}"</h3>
                    <p>Try searching with different keywords or check your spelling.</p>
                </div>
            `;
            return;
        }

        let html = '';

        // Display movies
        if (this.searchResults.movies.length > 0) {
            html += '<h3>Movies</h3>';
            html += this.createMoviesGrid(this.searchResults.movies);
        }

        // Display people
        if (this.searchResults.people.length > 0) {
            html += '<h3>People</h3>';
            html += this.createPeopleGrid(this.searchResults.people);
        }

        resultsContainer.innerHTML = html;

        // Setup pagination
        this.setupPagination();
    }

    createMoviesGrid(movies) {
        return `
            <div class="movies-grid">
                ${movies.map(movie => this.createMovieCard(movie)).join('')}
            </div>
        `;
    }

    createPeopleGrid(people) {
        return `
            <div class="people-grid">
                ${people.map(person => this.createPersonCard(person)).join('')}
            </div>
        `;
    }

    createMovieCard(movie) {
        const isFavorite = authManager.isFavorite(movie.id);
        
        return `
            <div class="movie-card" data-movie-id="${movie.id}" onclick="app.showMovieDetails(${movie.id})">
                <div class="movie-poster">
                    ${movie.posterPath ? 
                        `<img src="${movieAPI.getImageUrl(movie.posterPath)}" alt="${movie.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` :
                        ''
                    }
                    <div class="movie-poster-placeholder" ${movie.posterPath ? 'style="display:none;"' : ''}>
                        <i class="fas fa-film"></i>
                    </div>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="event.stopPropagation(); app.toggleFavorite(${movie.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-year">${movie.year || 'N/A'}</div>
                    <div class="movie-genres">${movie.genres.slice(0, 2).join(', ')}</div>
                    <div class="movie-rating">
                        <span class="rating-stars">${'★'.repeat(Math.floor(movie.rating / 2))}</span>
                        <span class="rating-value">${movie.rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    createPersonCard(person) {
        return `
            <div class="person-card" onclick="app.showPersonDetails(${person.id})">
                <div class="person-photo">
                    ${person.profilePath ? 
                        `<img src="${movieAPI.getImageUrl(person.profilePath, 'PROFILE')}" alt="${person.name}">` :
                        '<i class="fas fa-user"></i>'
                    }
                </div>
                <div class="person-info">
                    <div class="person-name">${person.name}</div>
                    <div class="person-popularity">Popularity: ${person.popularity.toFixed(1)}</div>
                </div>
            </div>
        `;
    }

    clearSearchResults() {
        const resultsContainer = document.getElementById('searchResultsGrid');
        const paginationContainer = document.getElementById('pagination');
        
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
        if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }
        
        this.searchResults = [];
        this.currentPage = 1;
    }

    // Trending movies functionality
    async loadTrendingMovies(type = 'trending') {
        try {
            let movies = [];
            
            switch (type) {
                case 'trending':
                    const trendingResult = await movieAPI.getTrendingMovies();
                    movies = trendingResult.results.map(movie => movieAPI.formatMovieData(movie));
                    break;
                case 'top-rated':
                    const topRatedResult = await movieAPI.getTopRatedMovies();
                    movies = topRatedResult.results.map(movie => movieAPI.formatMovieData(movie));
                    break;
                case 'popular':
                    const popularResult = await movieAPI.getPopularMovies();
                    movies = popularResult.results.map(movie => movieAPI.formatMovieData(movie));
                    break;
            }

            this.displayTrendingMovies(movies);
        } catch (error) {
            console.error('Failed to load trending movies:', error);
            this.showError('Failed to load trending movies');
        }
    }

    displayTrendingMovies(movies) {
        const container = document.getElementById('trendingMovies');
        if (!container) return;

        container.innerHTML = this.createMoviesGrid(movies);
    }

    async switchTrendingTab(tabType) {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabType}"]`).classList.add('active');

        // Load data for the selected tab
        await this.loadTrendingMovies(tabType);
    }

    // Movie details functionality
    async showMovieDetails(movieId) {
        try {
            this.showLoadingSpinner();
            
            const movieData = await movieAPI.getMovieDetails(movieId);
            this.displayMovieDetails(movieData);
            
            const modal = document.getElementById('movieModal');
            modal.style.display = 'block';
            
        } catch (error) {
            console.error('Failed to load movie details:', error);
            this.showError('Failed to load movie details');
        } finally {
            this.hideLoadingSpinner();
        }
    }

    displayMovieDetails(movie) {
        const container = document.getElementById('movieDetails');
        if (!container) return;

        const isFavorite = authManager.isFavorite(movie.id);

        container.innerHTML = `
            <div class="movie-details">
                <div class="movie-header">
                    <div class="movie-poster-large">
                        ${movie.poster_path ? 
                            `<img src="${movieAPI.getImageUrl(movie.poster_path)}" alt="${movie.title}">` :
                            '<div class="poster-placeholder"><i class="fas fa-film"></i></div>'
                        }
                    </div>
                    <div class="movie-info-large">
                        <h1>${movie.title}</h1>
                        <div class="movie-meta">
                            <span class="movie-year">${new Date(movie.release_date).getFullYear()}</span>
                            <span class="movie-runtime">${movie.runtime} min</span>
                            <span class="movie-rating">
                                <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}
                            </span>
                        </div>
                        <div class="movie-genres">
                            ${movie.genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
                        </div>
                        <p class="movie-overview">${movie.overview}</p>
                        <div class="movie-actions">
                            <button class="btn btn-primary" onclick="app.toggleFavorite(${movie.id})">
                                <i class="fas fa-heart"></i> 
                                ${isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </button>
                            <button class="btn btn-outline" onclick="app.shareMovie(${movie.id})">
                                <i class="fas fa-share"></i> Share
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="movie-stats">
                    <div class="stat-item">
                        <h3>Box Office</h3>
                        <p>$${(movie.budget || 0).toLocaleString()} budget</p>
                        <p>$${(movie.revenue || 0).toLocaleString()} revenue</p>
                    </div>
                    <div class="stat-item">
                        <h3>Rating</h3>
                        <p>${movie.vote_average.toFixed(1)}/10</p>
                        <p>${movie.vote_count.toLocaleString()} votes</p>
                    </div>
                    <div class="stat-item">
                        <h3>Popularity</h3>
                        <p>${movie.popularity.toFixed(1)}</p>
                    </div>
                </div>

                ${movie.credits && movie.credits.cast ? `
                    <div class="movie-cast">
                        <h3>Cast</h3>
                        <div class="cast-grid">
                            ${movie.credits.cast.slice(0, 6).map(actor => `
                                <div class="cast-member">
                                    <div class="cast-photo">
                                        ${actor.profile_path ? 
                                            `<img src="${movieAPI.getImageUrl(actor.profile_path, 'PROFILE')}" alt="${actor.name}">` :
                                            '<i class="fas fa-user"></i>'
                                        }
                                    </div>
                                    <div class="cast-info">
                                        <div class="cast-name">${actor.name}</div>
                                        <div class="cast-character">${actor.character}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${movie.similar && movie.similar.results.length > 0 ? `
                    <div class="similar-movies">
                        <h3>Similar Movies</h3>
                        <div class="movies-grid">
                            ${movie.similar.results.slice(0, 4).map(similarMovie => 
                                this.createMovieCard(movieAPI.formatMovieData(similarMovie))
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Person details functionality
    async showPersonDetails(personId) {
        try {
            this.showLoadingSpinner();
            
            const personData = await movieAPI.getPersonDetails(personId);
            this.displayPersonDetails(personData);
            
            const modal = document.getElementById('movieModal');
            modal.style.display = 'block';
            
        } catch (error) {
            console.error('Failed to load person details:', error);
            this.showError('Failed to load person details');
        } finally {
            this.hideLoadingSpinner();
        }
    }

    displayPersonDetails(person) {
        const container = document.getElementById('movieDetails');
        if (!container) return;

        container.innerHTML = `
            <div class="person-details">
                <div class="person-header">
                    <div class="person-photo-large">
                        ${person.profile_path ? 
                            `<img src="${movieAPI.getImageUrl(person.profile_path, 'PROFILE')}" alt="${person.name}">` :
                            '<div class="photo-placeholder"><i class="fas fa-user"></i></div>'
                        }
                    </div>
                    <div class="person-info-large">
                        <h1>${person.name}</h1>
                        <p class="person-biography">${person.biography || 'No biography available.'}</p>
                    </div>
                </div>
                
                ${person.movie_credits && person.movie_credits.cast ? `
                    <div class="person-filmography">
                        <h3>Filmography</h3>
                        <div class="movies-grid">
                            ${person.movie_credits.cast.slice(0, 12).map(movie => 
                                this.createMovieCard(movieAPI.formatMovieData(movie))
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Favorites functionality
    toggleFavorite(movieId) {
        if (authManager.isFavorite(movieId)) {
            authManager.removeFromFavorites(movieId);
        } else {
            authManager.addToFavorites(movieId);
        }
        
        // Update UI
        this.updateFavoriteButtons(movieId);
    }

    updateFavoriteButtons(movieId) {
        const favoriteButtons = document.querySelectorAll(`[data-movie-id="${movieId}"] .favorite-btn`);
        const isFavorite = authManager.isFavorite(movieId);
        
        favoriteButtons.forEach(btn => {
            if (isFavorite) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Movie comparison functionality
    async compareMovies() {
        const movie1Input = document.getElementById('compareMovie1');
        const movie2Input = document.getElementById('compareMovie2');
        
        const movie1Title = movie1Input.value.trim();
        const movie2Title = movie2Input.value.trim();
        
        if (!movie1Title || !movie2Title) {
            this.showError('Please enter both movie titles');
            return;
        }

        try {
            this.showLoadingSpinner();
            
            const [movie1Results, movie2Results] = await Promise.all([
                movieAPI.searchMovies(movie1Title),
                movieAPI.searchMovies(movie2Title)
            ]);

            if (movie1Results.results.length === 0 || movie2Results.results.length === 0) {
                this.showError('One or both movies not found');
                return;
            }

            const movie1 = await movieAPI.getMovieDetails(movie1Results.results[0].id);
            const movie2 = await movieAPI.getMovieDetails(movie2Results.results[0].id);
            
            this.displayMovieComparison(movie1, movie2);
            
        } catch (error) {
            console.error('Failed to compare movies:', error);
            this.showError('Failed to compare movies');
        } finally {
            this.hideLoadingSpinner();
        }
    }

    displayMovieComparison(movie1, movie2) {
        const container = document.getElementById('comparisonResults');
        if (!container) return;

        container.innerHTML = `
            <div class="comparison-table-container">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>${movie1.title}</th>
                            <th>${movie2.title}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Release Year</td>
                            <td>${new Date(movie1.release_date).getFullYear()}</td>
                            <td>${new Date(movie2.release_date).getFullYear()}</td>
                        </tr>
                        <tr>
                            <td>Rating</td>
                            <td>${movie1.vote_average.toFixed(1)}/10</td>
                            <td>${movie2.vote_average.toFixed(1)}/10</td>
                        </tr>
                        <tr>
                            <td>Runtime</td>
                            <td>${movie1.runtime} min</td>
                            <td>${movie2.runtime} min</td>
                        </tr>
                        <tr>
                            <td>Budget</td>
                            <td>$${(movie1.budget || 0).toLocaleString()}</td>
                            <td>$${(movie2.budget || 0).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>Revenue</td>
                            <td>$${(movie1.revenue || 0).toLocaleString()}</td>
                            <td>$${(movie2.revenue || 0).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>Genres</td>
                            <td>${movie1.genres.map(g => g.name).join(', ')}</td>
                            <td>${movie2.genres.map(g => g.name).join(', ')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    // Feedback functionality
    async handleFeedbackSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const feedback = {
            name: formData.get('name') || document.getElementById('feedbackName').value,
            email: formData.get('email') || document.getElementById('feedbackEmail').value,
            rating: formData.get('rating') || document.getElementById('feedbackRating').value,
            message: formData.get('message') || document.getElementById('feedbackMessage').value,
            timestamp: new Date().toISOString()
        };

        try {
            // Simulate API call (replace with actual feedback submission)
            await this.submitFeedback(feedback);
            
            e.target.reset();
            this.showSuccess('Thank you for your feedback!');
            
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            this.showError('Failed to submit feedback');
        }
    }

    async submitFeedback(feedback) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store feedback in localStorage (in real app, send to server)
        const feedbacks = JSON.parse(localStorage.getItem('movieStats_feedbacks') || '[]');
        feedbacks.push(feedback);
        localStorage.setItem('movieStats_feedbacks', JSON.stringify(feedbacks));
    }

    // Utility functions
    applyFilters() {
        // This would apply the current filters to search results
        // Implementation depends on specific filter requirements
        console.log('Applying filters...');
    }

    setupPagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer || !this.searchResults.totalPages) return;

        let html = '';
        
        // Previous button
        html += `<button ${this.currentPage === 1 ? 'disabled' : ''} 
                        onclick="app.loadPage(${this.currentPage - 1})">
                    Previous
                 </button>`;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.searchResults.totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            html += `<button ${i === this.currentPage ? 'class="active"' : ''} 
                            onclick="app.loadPage(${i})">
                        ${i}
                     </button>`;
        }

        // Next button
        html += `<button ${this.currentPage === this.searchResults.totalPages ? 'disabled' : ''} 
                        onclick="app.loadPage(${this.currentPage + 1})">
                    Next
                 </button>`;

        paginationContainer.innerHTML = html;
    }

    async loadPage(page) {
        if (page < 1 || page > this.searchResults.totalPages) return;
        
        this.currentPage = page;
        await this.performSearch();
    }

    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    shareMovie(movieId) {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this movie!',
                text: 'I found an interesting movie on MovieStats',
                url: window.location.href
            });
        } else {
            // Fallback to copying URL to clipboard
            navigator.clipboard.writeText(window.location.href);
            this.showSuccess('Movie URL copied to clipboard!');
        }
    }

    showLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'block';
        }
    }

    hideLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }

    showError(message) {
        authManager.showNotification(message, 'error');
    }

    showSuccess(message) {
        authManager.showNotification(message, 'success');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.app = new MovieStatsApp();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MovieStatsApp;
}
