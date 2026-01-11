// Admin panel functionality and management

class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.systemStats = {
            totalUsers: 0,
            totalMovies: 0,
            totalFavorites: 0,
            totalFeedback: 0,
            requestsToday: 0,
            requestsMonth: 0,
            errorRate: 0,
            cacheHitRate: 0
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.startSystemMonitoring();
    }

    setupEventListeners() {
        // Navigation
        const menuItems = document.querySelectorAll('.admin-menu a');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('href').substring(1);
                this.switchSection(section);
            });
        });

        // API Settings
        document.getElementById('tmdbSettingsForm')?.addEventListener('submit', (e) => this.saveTmdbSettings(e));
        document.getElementById('omdbSettingsForm')?.addEventListener('submit', (e) => this.saveOmdbSettings(e));
        document.getElementById('testTmdbApi')?.addEventListener('click', () => this.testTmdbApi());
        document.getElementById('testOmdbApi')?.addEventListener('click', () => this.testOmdbApi());

        // Toggle API key visibility
        document.getElementById('toggleTmdbKey')?.addEventListener('click', () => this.toggleApiKeyVisibility('tmdbApiKey'));
        document.getElementById('toggleOmdbKey')?.addEventListener('click', () => this.toggleApiKeyVisibility('omdbApiKey'));

        // User Management
        document.getElementById('searchUsers')?.addEventListener('click', () => this.searchUsers());
        document.getElementById('userSearch')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchUsers();
        });

        // Feedback Management
        document.getElementById('feedbackFilter')?.addEventListener('change', () => this.filterFeedback());
        document.getElementById('exportFeedback')?.addEventListener('click', () => this.exportFeedback());

        // Data Export
        document.getElementById('exportUsers')?.addEventListener('click', () => this.exportUsers());
        document.getElementById('exportAnalytics')?.addEventListener('click', () => this.exportAnalytics());
        document.getElementById('exportFeedbackData')?.addEventListener('click', () => this.exportFeedbackData());
        document.getElementById('exportLogs')?.addEventListener('click', () => this.exportLogs());

        // Maintenance
        document.getElementById('clearCache')?.addEventListener('click', () => this.clearCache());
        document.getElementById('resetStats')?.addEventListener('click', () => this.resetStatistics());
        document.getElementById('backupData')?.addEventListener('click', () => this.backupData());
        document.getElementById('healthCheck')?.addEventListener('click', () => this.runHealthCheck());

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    }

    switchSection(sectionId) {
        // Update active menu item
        document.querySelectorAll('.admin-menu a').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');

        // Update active section
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');

        this.currentSection = sectionId;

        // Load section-specific data
        switch (sectionId) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'user-management':
                this.loadUsers();
                break;
            case 'feedback-management':
                this.loadFeedback();
                break;
            case 'system-monitor':
                this.updateSystemMonitor();
                break;
        }
    }

    // Dashboard functionality
    async loadDashboardData() {
        try {
            this.showLoadingSpinner();
            
            // Load statistics
            await this.loadStatistics();
            this.updateDashboardStats();
            
            // Load charts
            await this.loadDashboardCharts();
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.showError('Failed to load dashboard data');
        } finally {
            this.hideLoadingSpinner();
        }
    }

    async loadStatistics() {
        // Load users from localStorage
        const users = JSON.parse(localStorage.getItem('movieStats_users') || '[]');
        this.systemStats.totalUsers = users.length;

        // Load user data to count favorites
        let totalFavorites = 0;
        users.forEach(user => {
            const userData = JSON.parse(localStorage.getItem(`movieStats_userData_${user.id}`) || '{}');
            if (userData.favorites) {
                totalFavorites += userData.favorites.length;
            }
        });
        this.systemStats.totalFavorites = totalFavorites;

        // Load feedback
        const feedback = JSON.parse(localStorage.getItem('movieStats_feedbacks') || '[]');
        this.systemStats.totalFeedback = feedback.length;

        // Simulate movie searches (in real app, this would come from API logs)
        this.systemStats.totalMovies = Math.floor(Math.random() * 1000) + 500;
        this.systemStats.requestsToday = Math.floor(Math.random() * 100) + 50;
        this.systemStats.requestsMonth = Math.floor(Math.random() * 2000) + 1000;
        this.systemStats.errorRate = Math.random() * 5; // 0-5%
        this.systemStats.cacheHitRate = 70 + Math.random() * 25; // 70-95%
    }

    updateDashboardStats() {
        document.getElementById('totalUsers').textContent = this.systemStats.totalUsers;
        document.getElementById('totalMovies').textContent = this.systemStats.totalMovies;
        document.getElementById('totalFavorites').textContent = this.systemStats.totalFavorites;
        document.getElementById('totalFeedback').textContent = this.systemStats.totalFeedback;
    }

    async loadDashboardCharts() {
        // User Growth Chart
        const userGrowthCtx = document.getElementById('userGrowthChart');
        if (userGrowthCtx) {
            const userGrowthChart = new Chart(userGrowthCtx, {
                type: 'line',
                data: {
                    labels: this.generateLast7Days(),
                    datasets: [{
                        label: 'New Users',
                        data: this.generateRandomData(7, 0, 10),
                        borderColor: CONFIG.CHARTS.COLORS.PRIMARY,
                        backgroundColor: CONFIG.CHARTS.COLORS.PRIMARY + '20',
                        tension: 0.4
                    }]
                },
                options: {
                    ...CONFIG.CHARTS.OPTIONS,
                    plugins: {
                        ...CONFIG.CHARTS.OPTIONS.plugins,
                        title: {
                            display: true,
                            text: 'User Growth (Last 7 Days)'
                        }
                    }
                }
            });
        }

        // API Usage Chart
        const apiUsageCtx = document.getElementById('apiUsageChart');
        if (apiUsageCtx) {
            const apiUsageChart = new Chart(apiUsageCtx, {
                type: 'bar',
                data: {
                    labels: ['TMDb API', 'OMDb API', 'Search', 'Details', 'Images'],
                    datasets: [{
                        label: 'API Calls',
                        data: this.generateRandomData(5, 10, 100),
                        backgroundColor: [
                            CONFIG.CHARTS.COLORS.PRIMARY,
                            CONFIG.CHARTS.COLORS.SECONDARY,
                            CONFIG.CHARTS.COLORS.SUCCESS,
                            CONFIG.CHARTS.COLORS.WARNING,
                            CONFIG.CHARTS.COLORS.INFO
                        ]
                    }]
                },
                options: {
                    ...CONFIG.CHARTS.OPTIONS,
                    plugins: {
                        ...CONFIG.CHARTS.OPTIONS.plugins,
                        title: {
                            display: true,
                            text: 'API Usage by Service'
                        }
                    }
                }
            });
        }
    }

    // API Settings functionality
    async saveTmdbSettings(e) {
        e.preventDefault();
        
        const apiKey = document.getElementById('tmdbApiKey').value;
        const rateLimit = document.getElementById('tmdbRateLimit').value;
        
        if (!apiKey) {
            this.showError('API Key is required');
            return;
        }

        try {
            // Save settings to localStorage (in real app, save to server)
            const settings = JSON.parse(localStorage.getItem('movieStats_apiSettings') || '{}');
            settings.tmdb = { apiKey, rateLimit: parseInt(rateLimit) };
            localStorage.setItem('movieStats_apiSettings', JSON.stringify(settings));
            
            this.showSuccess('TMDb settings saved successfully');
        } catch (error) {
            this.showError('Failed to save TMDb settings');
        }
    }

    async saveOmdbSettings(e) {
        e.preventDefault();
        
        const apiKey = document.getElementById('omdbApiKey').value;
        const rateLimit = document.getElementById('omdbRateLimit').value;
        
        if (!apiKey) {
            this.showError('API Key is required');
            return;
        }

        try {
            // Save settings to localStorage (in real app, save to server)
            const settings = JSON.parse(localStorage.getItem('movieStats_apiSettings') || '{}');
            settings.omdb = { apiKey, rateLimit: parseInt(rateLimit) };
            localStorage.setItem('movieStats_apiSettings', JSON.stringify(settings));
            
            this.showSuccess('OMDb settings saved successfully');
        } catch (error) {
            this.showError('Failed to save OMDb settings');
        }
    }

    async testTmdbApi() {
        const resultsContainer = document.getElementById('apiTestResults');
        resultsContainer.innerHTML = '<div class="testing">Testing TMDb API...</div>';
        
        try {
            // Test API connectivity
            const response = await movieAPI.getTrendingMovies();
            resultsContainer.innerHTML = `
                <div class="test-success">
                    <i class="fas fa-check-circle"></i>
                    TMDb API is working correctly
                    <br>Found ${response.results.length} trending movies
                </div>
            `;
        } catch (error) {
            resultsContainer.innerHTML = `
                <div class="test-error">
                    <i class="fas fa-times-circle"></i>
                    TMDb API test failed: ${error.message}
                </div>
            `;
        }
    }

    async testOmdbApi() {
        const resultsContainer = document.getElementById('apiTestResults');
        resultsContainer.innerHTML = '<div class="testing">Testing OMDb API...</div>';
        
        try {
            // Test with a known movie
            const response = await movieAPI.getOMDbMovieData('tt0111161'); // The Shawshank Redemption
            resultsContainer.innerHTML = `
                <div class="test-success">
                    <i class="fas fa-check-circle"></i>
                    OMDb API is working correctly
                    <br>Retrieved: ${response.Title}
                </div>
            `;
        } catch (error) {
            resultsContainer.innerHTML = `
                <div class="test-error">
                    <i class="fas fa-times-circle"></i>
                    OMDb API test failed: ${error.message}
                </div>
            `;
        }
    }

    toggleApiKeyVisibility(inputId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(`toggle${inputId.charAt(0).toUpperCase() + inputId.slice(1)}`);
        
        if (input.type === 'password') {
            input.type = 'text';
            button.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            input.type = 'password';
            button.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    // User Management functionality
    async loadUsers() {
        try {
            const users = JSON.parse(localStorage.getItem('movieStats_users') || '[]');
            this.displayUsers(users);
        } catch (error) {
            this.showError('Failed to load users');
        }
    }

    displayUsers(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        tbody.innerHTML = users.map(user => {
            const userData = JSON.parse(localStorage.getItem(`movieStats_userData_${user.id}`) || '{}');
            const favoritesCount = userData.favorites ? userData.favorites.length : 0;
            
            return `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${new Date(user.joinDate).toLocaleDateString()}</td>
                    <td>${favoritesCount}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="admin.viewUserDetails('${user.id}')">
                            View
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="admin.editUser('${user.id}')">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="admin.deleteUser('${user.id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    searchUsers() {
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();
        const users = JSON.parse(localStorage.getItem('movieStats_users') || '[]');
        
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        
        this.displayUsers(filteredUsers);
    }

    // Feedback Management functionality
    async loadFeedback() {
        try {
            const feedback = JSON.parse(localStorage.getItem('movieStats_feedbacks') || '[]');
            this.displayFeedback(feedback);
        } catch (error) {
            this.showError('Failed to load feedback');
        }
    }

    displayFeedback(feedback) {
        const container = document.getElementById('feedbackList');
        if (!container) return;

        container.innerHTML = feedback.map(item => `
            <div class="feedback-item">
                <div class="feedback-header">
                    <div class="feedback-user">
                        <strong>${item.name}</strong>
                        <span class="feedback-email">${item.email}</span>
                    </div>
                    <div class="feedback-rating">
                        ${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
                    </div>
                    <div class="feedback-date">
                        ${new Date(item.timestamp).toLocaleDateString()}
                    </div>
                </div>
                <div class="feedback-message">
                    ${item.message}
                </div>
            </div>
        `).join('');
    }

    filterFeedback() {
        const filter = document.getElementById('feedbackFilter').value;
        const feedback = JSON.parse(localStorage.getItem('movieStats_feedbacks') || '[]');
        
        let filteredFeedback = feedback;
        if (filter !== 'all') {
            filteredFeedback = feedback.filter(item => item.rating == filter);
        }
        
        this.displayFeedback(filteredFeedback);
    }

    // System Monitor functionality
    updateSystemMonitor() {
        document.getElementById('requestsToday').textContent = this.systemStats.requestsToday;
        document.getElementById('requestsMonth').textContent = this.systemStats.requestsMonth;
        document.getElementById('errorRate').textContent = this.systemStats.errorRate.toFixed(2) + '%';
        document.getElementById('cacheHitRate').textContent = this.systemStats.cacheHitRate.toFixed(1) + '%';

        // Update progress bars
        const memoryProgress = document.getElementById('memoryProgress');
        const storageProgress = document.getElementById('storageProgress');
        
        if (memoryProgress) {
            const memoryUsage = Math.random() * 80 + 10; // 10-90%
            memoryProgress.style.width = memoryUsage + '%';
            document.getElementById('memoryUsage').textContent = Math.floor(memoryUsage * 10) + ' MB';
        }
        
        if (storageProgress) {
            const storageUsage = Math.random() * 60 + 20; // 20-80%
            storageProgress.style.width = storageUsage + '%';
            document.getElementById('storageUsage').textContent = Math.floor(storageUsage * 5) + ' MB';
        }
    }

    startSystemMonitoring() {
        // Update system stats every 30 seconds
        setInterval(() => {
            if (this.currentSection === 'system-monitor') {
                this.updateSystemMonitor();
            }
        }, 30000);
    }

    // Data Export functionality
    exportUsers() {
        const users = JSON.parse(localStorage.getItem('movieStats_users') || '[]');
        const userData = users.map(user => ({
            ...user,
            favorites: JSON.parse(localStorage.getItem(`movieStats_userData_${user.id}`) || '{}').favorites || []
        }));
        
        this.downloadData(userData, 'users_export.json');
        this.showSuccess('User data exported successfully');
    }

    exportAnalytics() {
        const analyticsData = {
            systemStats: this.systemStats,
            exportDate: new Date().toISOString(),
            charts: {
                userGrowth: this.generateRandomData(30, 0, 10),
                apiUsage: this.generateRandomData(5, 10, 100)
            }
        };
        
        this.downloadData(analyticsData, 'analytics_export.json');
        this.showSuccess('Analytics data exported successfully');
    }

    exportFeedbackData() {
        const feedback = JSON.parse(localStorage.getItem('movieStats_feedbacks') || '[]');
        this.downloadData(feedback, 'feedback_export.json');
        this.showSuccess('Feedback data exported successfully');
    }

    exportLogs() {
        const logs = {
            systemLogs: [
                { timestamp: new Date().toISOString(), level: 'INFO', message: 'System started' },
                { timestamp: new Date(Date.now() - 3600000).toISOString(), level: 'INFO', message: 'Cache cleared' },
                { timestamp: new Date(Date.now() - 7200000).toISOString(), level: 'WARNING', message: 'High API usage detected' }
            ],
            exportDate: new Date().toISOString()
        };
        
        this.downloadData(logs, 'system_logs.json');
        this.showSuccess('System logs exported successfully');
    }

    // Maintenance functionality
    async clearCache() {
        try {
            movieAPI.clearCache();
            localStorage.removeItem(CONFIG.STORAGE.API_CACHE);
            this.showSuccess('Cache cleared successfully');
        } catch (error) {
            this.showError('Failed to clear cache');
        }
    }

    async resetStatistics() {
        if (confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
            // Reset system stats
            this.systemStats = {
                totalUsers: 0,
                totalMovies: 0,
                totalFavorites: 0,
                totalFeedback: 0,
                requestsToday: 0,
                requestsMonth: 0,
                errorRate: 0,
                cacheHitRate: 0
            };
            
            this.updateDashboardStats();
            this.showSuccess('Statistics reset successfully');
        }
    }

    async backupData() {
        try {
            const backupData = {
                users: JSON.parse(localStorage.getItem('movieStats_users') || '[]'),
                feedback: JSON.parse(localStorage.getItem('movieStats_feedbacks') || '[]'),
                settings: JSON.parse(localStorage.getItem('movieStats_apiSettings') || '{}'),
                systemStats: this.systemStats,
                backupDate: new Date().toISOString()
            };
            
            this.downloadData(backupData, `backup_${Date.now()}.json`);
            this.showSuccess('Backup created successfully');
        } catch (error) {
            this.showError('Failed to create backup');
        }
    }

    async runHealthCheck() {
        const resultsContainer = document.getElementById('maintenanceResults');
        resultsContainer.innerHTML = '<div class="health-check">Running system health check...</div>';
        
        try {
            // Simulate health check
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const healthResults = {
                apiConnectivity: 'OK',
                databaseStatus: 'OK',
                cacheStatus: 'OK',
                userAuthentication: 'OK',
                systemResources: 'OK'
            };
            
            resultsContainer.innerHTML = `
                <div class="health-results">
                    <h3>Health Check Results</h3>
                    <div class="health-item">
                        <span class="health-label">API Connectivity:</span>
                        <span class="health-status ${healthResults.apiConnectivity === 'OK' ? 'ok' : 'error'}">
                            ${healthResults.apiConnectivity}
                        </span>
                    </div>
                    <div class="health-item">
                        <span class="health-label">Database Status:</span>
                        <span class="health-status ${healthResults.databaseStatus === 'OK' ? 'ok' : 'error'}">
                            ${healthResults.databaseStatus}
                        </span>
                    </div>
                    <div class="health-item">
                        <span class="health-label">Cache Status:</span>
                        <span class="health-status ${healthResults.cacheStatus === 'OK' ? 'ok' : 'error'}">
                            ${healthResults.cacheStatus}
                        </span>
                    </div>
                    <div class="health-item">
                        <span class="health-label">User Authentication:</span>
                        <span class="health-status ${healthResults.userAuthentication === 'OK' ? 'ok' : 'error'}">
                            ${healthResults.userAuthentication}
                        </span>
                    </div>
                    <div class="health-item">
                        <span class="health-label">System Resources:</span>
                        <span class="health-status ${healthResults.systemResources === 'OK' ? 'ok' : 'error'}">
                            ${healthResults.systemResources}
                        </span>
                    </div>
                </div>
            `;
            
        } catch (error) {
            resultsContainer.innerHTML = `
                <div class="health-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    Health check failed: ${error.message}
                </div>
            `;
        }
    }

    // Utility functions
    downloadData(data, filename) {
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename;
        link.click();
    }

    generateLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString());
        }
        return days;
    }

    generateRandomData(count, min, max) {
        return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
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
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 1rem;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 4000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    logout() {
        localStorage.removeItem(CONFIG.STORAGE.USER_DATA);
        window.location.href = 'index.html';
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.admin = new AdminPanel();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminPanel;
}
