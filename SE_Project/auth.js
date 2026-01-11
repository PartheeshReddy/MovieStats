// Authentication and user management system

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.favorites = new Set();
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login/Register buttons
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showAuthModal('login'));
        document.getElementById('registerBtn')?.addEventListener('click', () => this.showAuthModal('register'));

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close') || e.target.classList.contains('modal')) {
                this.hideAuthModal();
            }
        });
    }

    // Show authentication modal
    showAuthModal(type = 'login') {
        const modal = document.getElementById('authModal');
        const content = document.getElementById('authContent');
        
        if (type === 'login') {
            content.innerHTML = this.getLoginForm();
        } else {
            content.innerHTML = this.getRegisterForm();
        }
        
        modal.style.display = 'block';
        this.setupFormEventListeners();
    }

    // Hide authentication modal
    hideAuthModal() {
        const modal = document.getElementById('authModal');
        modal.style.display = 'none';
    }

    // Get login form HTML
    getLoginForm() {
        return `
            <div class="auth-form">
                <h2>Login</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="loginEmail">Email</label>
                        <input type="email" id="loginEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                    <p class="auth-switch">
                        Don't have an account? 
                        <a href="#" id="switchToRegister">Register here</a>
                    </p>
                </form>
            </div>
        `;
    }

    // Get register form HTML
    getRegisterForm() {
        return `
            <div class="auth-form">
                <h2>Register</h2>
                <form id="registerForm">
                    <div class="form-group">
                        <label for="registerName">Full Name</label>
                        <input type="text" id="registerName" required>
                    </div>
                    <div class="form-group">
                        <label for="registerEmail">Email</label>
                        <input type="email" id="registerEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="registerPassword">Password</label>
                        <input type="password" id="registerPassword" required minlength="6">
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" required minlength="6">
                    </div>
                    <button type="submit" class="btn btn-primary">Register</button>
                    <p class="auth-switch">
                        Already have an account? 
                        <a href="#" id="switchToLogin">Login here</a>
                    </p>
                </form>
            </div>
        `;
    }

    // Setup form event listeners
    setupFormEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Switch between forms
        document.getElementById('switchToRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthModal('register');
        });

        document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAuthModal('login');
        });
    }

    // Handle login
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            // Simulate API call (replace with actual authentication)
            const user = await this.authenticateUser(email, password);
            
            if (user) {
                this.currentUser = user;
                this.saveUserData();
                this.updateUI();
                this.hideAuthModal();
                this.showNotification('Login successful!', 'success');
            } else {
                this.showNotification('Invalid credentials', 'error');
            }
        } catch (error) {
            this.showNotification('Login failed. Please try again.', 'error');
        }
    }

    // Handle registration
    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        try {
            // Simulate API call (replace with actual registration)
            const user = await this.registerUser({ name, email, password });
            
            if (user) {
                this.currentUser = user;
                this.saveUserData();
                this.updateUI();
                this.hideAuthModal();
                this.showNotification('Registration successful!', 'success');
            } else {
                this.showNotification('Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            this.showNotification('Registration failed. Please try again.', 'error');
        }
    }

    // Simulate user authentication (replace with actual API call)
    async authenticateUser(email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user exists in localStorage (simplified)
        const users = JSON.parse(localStorage.getItem('movieStats_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                joinDate: user.joinDate
            };
        }
        
        return null;
    }

    // Simulate user registration (replace with actual API call)
    async registerUser(userData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const users = JSON.parse(localStorage.getItem('movieStats_users') || '[]');
        
        // Check if user already exists
        if (users.find(u => u.email === userData.email)) {
            throw new Error('User already exists');
        }
        
        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // In real app, this should be hashed
            joinDate: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('movieStats_users', JSON.stringify(users));
        
        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            joinDate: newUser.joinDate
        };
    }

    // Update UI based on authentication state
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const userAuth = document.querySelector('.user-auth');

        if (this.currentUser) {
            userAuth.innerHTML = `
                <span class="user-name">Welcome, ${this.currentUser.name}</span>
                <button id="logoutBtn" class="btn btn-outline">Logout</button>
                <button id="favoritesBtn" class="btn btn-primary">
                    <i class="fas fa-heart"></i> Favorites (${this.favorites.size})
                </button>
            `;

            // Add event listeners for new buttons
            document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
            document.getElementById('favoritesBtn')?.addEventListener('click', () => this.showFavorites());
        } else {
            userAuth.innerHTML = `
                <button id="loginBtn" class="btn btn-outline">Login</button>
                <button id="registerBtn" class="btn btn-primary">Register</button>
            `;

            // Re-add event listeners
            document.getElementById('loginBtn')?.addEventListener('click', () => this.showAuthModal('login'));
            document.getElementById('registerBtn')?.addEventListener('click', () => this.showAuthModal('register'));
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        this.favorites.clear();
        this.saveUserData();
        this.updateUI();
        this.showNotification('Logged out successfully', 'success');
    }

    // Show user favorites
    showFavorites() {
        if (this.favorites.size === 0) {
            this.showNotification('No favorites yet. Add some movies to your favorites!', 'info');
            return;
        }

        // Create favorites modal or navigate to favorites page
        this.displayFavorites();
    }

    // Display favorites
    displayFavorites() {
        const modal = document.getElementById('movieModal');
        const content = document.getElementById('movieDetails');
        
        content.innerHTML = `
            <div class="favorites-list">
                <h2>Your Favorite Movies</h2>
                <div id="favoritesGrid" class="movies-grid">
                    ${Array.from(this.favorites).map(id => 
                        `<div class="movie-card" data-movie-id="${id}">
                            <div class="movie-poster">
                                <i class="fas fa-film"></i>
                            </div>
                            <div class="movie-info">
                                <div class="movie-title">Loading...</div>
                            </div>
                        </div>`
                    ).join('')}
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Load favorite movie details
        this.loadFavoriteMovies();
    }

    // Load favorite movies data
    async loadFavoriteMovies() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        
        for (const movieId of this.favorites) {
            try {
                const movieData = await movieAPI.getMovieDetails(movieId);
                const movieCard = favoritesGrid.querySelector(`[data-movie-id="${movieId}"]`);
                
                if (movieCard) {
                    movieCard.innerHTML = `
                        <div class="movie-poster">
                            <img src="${movieAPI.getImageUrl(movieData.poster_path)}" 
                                 alt="${movieData.title}" 
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="movie-poster-placeholder" style="display:none;">
                                <i class="fas fa-film"></i>
                            </div>
                        </div>
                        <div class="movie-info">
                            <div class="movie-title">${movieData.title}</div>
                            <div class="movie-year">${new Date(movieData.release_date).getFullYear()}</div>
                            <div class="movie-rating">
                                <span class="rating-stars">${'★'.repeat(Math.floor(movieData.vote_average / 2))}</span>
                                <span class="rating-value">${movieData.vote_average.toFixed(1)}</span>
                            </div>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Failed to load favorite movie:', error);
            }
        }
    }

    // Add movie to favorites
    addToFavorites(movieId) {
        if (!this.currentUser) {
            this.showNotification('Please login to add favorites', 'warning');
            this.showAuthModal('login');
            return;
        }

        this.favorites.add(movieId.toString());
        this.saveUserData();
        this.updateUI();
        this.showNotification('Added to favorites!', 'success');
    }

    // Remove movie from favorites
    removeFromFavorites(movieId) {
        this.favorites.delete(movieId.toString());
        this.saveUserData();
        this.updateUI();
        this.showNotification('Removed from favorites', 'info');
    }

    // Check if movie is in favorites
    isFavorite(movieId) {
        return this.favorites.has(movieId.toString());
    }

    // Save user data to localStorage
    saveUserData() {
        const userData = {
            currentUser: this.currentUser,
            favorites: Array.from(this.favorites)
        };
        localStorage.setItem(CONFIG.STORAGE.USER_DATA, JSON.stringify(userData));
    }

    // Load user data from localStorage
    loadUserData() {
        try {
            const userData = JSON.parse(localStorage.getItem(CONFIG.STORAGE.USER_DATA) || '{}');
            this.currentUser = userData.currentUser || null;
            this.favorites = new Set(userData.favorites || []);
        } catch (error) {
            console.error('Failed to load user data:', error);
            this.currentUser = null;
            this.favorites = new Set();
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196f3'};
            color: white;
            padding: 1rem;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 4000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        // Add to document
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Generate custom report
    generateReport() {
        if (!this.currentUser) {
            this.showNotification('Please login to generate reports', 'warning');
            return;
        }

        // Implementation for custom reports
        this.showNotification('Report generation feature coming soon!', 'info');
    }

    // Export user data
    exportUserData() {
        if (!this.currentUser) {
            this.showNotification('Please login to export data', 'warning');
            return;
        }

        const userData = {
            user: this.currentUser,
            favorites: Array.from(this.favorites),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `movieStats_${this.currentUser.name}_${Date.now()}.json`;
        link.click();
        
        this.showNotification('Data exported successfully!', 'success');
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
