// Analytics and charting system for movie data visualization

class MovieAnalytics {
    constructor() {
        this.charts = {};
        this.movieData = [];
        this.init();
    }

    init() {
        this.setupChartContainers();
        this.loadAnalyticsData();
    }

    setupChartContainers() {
        // Ensure all chart containers have proper dimensions
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.style.height = '400px';
            container.style.position = 'relative';
        });
    }

    // Load and process analytics data
    async loadAnalyticsData() {
        try {
            this.showLoadingSpinner();
            
            // Get comprehensive movie data
            const statistics = await movieAPI.getMovieStatistics();
            this.movieData = [
                ...statistics.trending,
                ...statistics.topRated,
                ...statistics.popular
            ];

            // Remove duplicates based on movie ID
            const uniqueMovies = new Map();
            this.movieData.forEach(movie => {
                if (!uniqueMovies.has(movie.id)) {
                    uniqueMovies.set(movie.id, movie);
                }
            });
            this.movieData = Array.from(uniqueMovies.values());

            // Generate all charts
            await this.generateAllCharts();
            
            this.hideLoadingSpinner();
        } catch (error) {
            console.error('Failed to load analytics data:', error);
            this.hideLoadingSpinner();
            this.showError('Failed to load analytics data');
        }
    }

    // Generate all charts
    async generateAllCharts() {
        await Promise.all([
            this.generateGenreChart(),
            this.generateYearChart(),
            this.generateRatingChart(),
            this.generateBoxOfficeChart()
        ]);
    }

    // Generate genre distribution chart
    async generateGenreChart() {
        const ctx = document.getElementById('genreChart');
        if (!ctx) return;

        // Calculate genre distribution
        const genreCounts = {};
        this.movieData.forEach(movie => {
            movie.genres.forEach(genre => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
        });

        // Sort genres by count
        const sortedGenres = Object.entries(genreCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10); // Top 10 genres

        const chartData = {
            labels: sortedGenres.map(([genre]) => genre),
            datasets: [{
                label: 'Number of Movies',
                data: sortedGenres.map(([, count]) => count),
                backgroundColor: [
                    CONFIG.CHARTS.COLORS.PRIMARY,
                    CONFIG.CHARTS.COLORS.SECONDARY,
                    CONFIG.CHARTS.COLORS.SUCCESS,
                    CONFIG.CHARTS.COLORS.WARNING,
                    CONFIG.CHARTS.COLORS.DANGER,
                    CONFIG.CHARTS.COLORS.INFO,
                    '#9c27b0',
                    '#ff9800',
                    '#795548',
                    '#607d8b'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        };

        this.charts.genre = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                ...CONFIG.CHARTS.OPTIONS,
                plugins: {
                    ...CONFIG.CHARTS.OPTIONS.plugins,
                    title: {
                        display: true,
                        text: 'Genre Distribution'
                    }
                }
            }
        });
    }

    // Generate year distribution chart
    async generateYearChart() {
        const ctx = document.getElementById('yearChart');
        if (!ctx) return;

        // Calculate year distribution
        const yearCounts = {};
        this.movieData.forEach(movie => {
            if (movie.year) {
                yearCounts[movie.year] = (yearCounts[movie.year] || 0) + 1;
            }
        });

        // Get last 10 years
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= currentYear - 9; year--) {
            years.push(year);
        }

        const chartData = {
            labels: years,
            datasets: [{
                label: 'Movies Released',
                data: years.map(year => yearCounts[year] || 0),
                backgroundColor: CONFIG.CHARTS.COLORS.PRIMARY + '20',
                borderColor: CONFIG.CHARTS.COLORS.PRIMARY,
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };

        this.charts.year = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                ...CONFIG.CHARTS.OPTIONS,
                plugins: {
                    ...CONFIG.CHARTS.OPTIONS.plugins,
                    title: {
                        display: true,
                        text: 'Movies by Release Year'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // Generate rating distribution chart
    async generateRatingChart() {
        const ctx = document.getElementById('ratingChart');
        if (!ctx) return;

        // Calculate rating distribution
        const ratingRanges = {
            '9-10': 0,
            '8-9': 0,
            '7-8': 0,
            '6-7': 0,
            '5-6': 0,
            '4-5': 0,
            '3-4': 0,
            '2-3': 0,
            '1-2': 0,
            '0-1': 0
        };

        this.movieData.forEach(movie => {
            const rating = movie.rating;
            if (rating >= 9) ratingRanges['9-10']++;
            else if (rating >= 8) ratingRanges['8-9']++;
            else if (rating >= 7) ratingRanges['7-8']++;
            else if (rating >= 6) ratingRanges['6-7']++;
            else if (rating >= 5) ratingRanges['5-6']++;
            else if (rating >= 4) ratingRanges['4-5']++;
            else if (rating >= 3) ratingRanges['3-4']++;
            else if (rating >= 2) ratingRanges['2-3']++;
            else if (rating >= 1) ratingRanges['1-2']++;
            else ratingRanges['0-1']++;
        });

        const chartData = {
            labels: Object.keys(ratingRanges),
            datasets: [{
                label: 'Number of Movies',
                data: Object.values(ratingRanges),
                backgroundColor: CONFIG.CHARTS.COLORS.SUCCESS + '80',
                borderColor: CONFIG.CHARTS.COLORS.SUCCESS,
                borderWidth: 2
            }]
        };

        this.charts.rating = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                ...CONFIG.CHARTS.OPTIONS,
                plugins: {
                    ...CONFIG.CHARTS.OPTIONS.plugins,
                    title: {
                        display: true,
                        text: 'Rating Distribution'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // Generate box office performance chart (simulated data)
    async generateBoxOfficeChart() {
        const ctx = document.getElementById('boxOfficeChart');
        if (!ctx) return;

        // Get top 10 movies by popularity for box office simulation
        const topMovies = this.movieData
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 10);

        // Simulate box office data (in millions)
        const boxOfficeData = topMovies.map((movie, index) => ({
            title: movie.title.length > 20 ? movie.title.substring(0, 20) + '...' : movie.title,
            revenue: Math.floor(Math.random() * 500) + 100, // 100-600 million
            budget: Math.floor(Math.random() * 200) + 50    // 50-250 million
        }));

        const chartData = {
            labels: boxOfficeData.map(movie => movie.title),
            datasets: [
                {
                    label: 'Revenue (Millions)',
                    data: boxOfficeData.map(movie => movie.revenue),
                    backgroundColor: CONFIG.CHARTS.COLORS.SUCCESS + '80',
                    borderColor: CONFIG.CHARTS.COLORS.SUCCESS,
                    borderWidth: 2
                },
                {
                    label: 'Budget (Millions)',
                    data: boxOfficeData.map(movie => movie.budget),
                    backgroundColor: CONFIG.CHARTS.COLORS.WARNING + '80',
                    borderColor: CONFIG.CHARTS.COLORS.WARNING,
                    borderWidth: 2
                }
            ]
        };

        this.charts.boxOffice = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                ...CONFIG.CHARTS.OPTIONS,
                plugins: {
                    ...CONFIG.CHARTS.OPTIONS.plugins,
                    title: {
                        display: true,
                        text: 'Box Office Performance vs Budget'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount (Millions USD)'
                        }
                    }
                }
            }
        });
    }

    // Generate custom analytics based on user filters
    async generateCustomAnalytics(filters = {}) {
        try {
            const filteredMovies = await this.filterMovies(filters);
            
            // Create custom charts based on filtered data
            await this.createCustomCharts(filteredMovies);
            
        } catch (error) {
            console.error('Failed to generate custom analytics:', error);
            this.showError('Failed to generate custom analytics');
        }
    }

    // Filter movies based on criteria
    async filterMovies(filters) {
        let filteredMovies = [...this.movieData];

        if (filters.genre) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.genres.some(genre => 
                    genre.toLowerCase().includes(filters.genre.toLowerCase())
                )
            );
        }

        if (filters.year) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.year === parseInt(filters.year)
            );
        }

        if (filters.minRating) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.rating >= parseFloat(filters.minRating)
            );
        }

        if (filters.language) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.originalLanguage === filters.language
            );
        }

        return filteredMovies;
    }

    // Create custom charts for filtered data
    async createCustomCharts(movies) {
        // This would create additional charts based on filtered data
        // Implementation depends on specific requirements
        console.log('Custom analytics for', movies.length, 'movies');
    }

    // Export analytics data
    exportAnalyticsData() {
        const analyticsData = {
            totalMovies: this.movieData.length,
            averageRating: this.calculateAverageRating(),
            topGenres: this.getTopGenres(),
            yearDistribution: this.getYearDistribution(),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(analyticsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `movie_analytics_${Date.now()}.json`;
        link.click();
    }

    // Calculate average rating
    calculateAverageRating() {
        const totalRating = this.movieData.reduce((sum, movie) => sum + movie.rating, 0);
        return (totalRating / this.movieData.length).toFixed(2);
    }

    // Get top genres
    getTopGenres() {
        const genreCounts = {};
        this.movieData.forEach(movie => {
            movie.genres.forEach(genre => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
        });

        return Object.entries(genreCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([genre, count]) => ({ genre, count }));
    }

    // Get year distribution
    getYearDistribution() {
        const yearCounts = {};
        this.movieData.forEach(movie => {
            if (movie.year) {
                yearCounts[movie.year] = (yearCounts[movie.year] || 0) + 1;
            }
        });

        return Object.entries(yearCounts)
            .sort(([a], [b]) => b - a)
            .map(([year, count]) => ({ year: parseInt(year), count }));
    }

    // Show loading spinner
    showLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'block';
        }
    }

    // Hide loading spinner
    hideLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }

    // Show error message
    showError(message) {
        authManager.showNotification(message, 'error');
    }

    // Destroy all charts
    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    // Refresh analytics
    async refreshAnalytics() {
        this.destroyCharts();
        await this.loadAnalyticsData();
    }

    // Get analytics summary
    getAnalyticsSummary() {
        return {
            totalMovies: this.movieData.length,
            averageRating: this.calculateAverageRating(),
            topGenre: this.getTopGenres()[0]?.genre || 'N/A',
            mostProductiveYear: this.getYearDistribution()[0]?.year || 'N/A',
            highRatedMovies: this.movieData.filter(movie => movie.rating >= 8).length
        };
    }
}

// Create global analytics instance
const movieAnalytics = new MovieAnalytics();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MovieAnalytics;
}
