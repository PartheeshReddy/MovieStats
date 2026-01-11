# MovieStats
# MovieStats - Movie Analytics Platform

A comprehensive web application for discovering, analyzing, and comparing movies with real-time data from TMDb and OMDb APIs.

## Features

### 🎬 Core Features
- **Movie Search**: Search movies by title, actor, or director
- **Advanced Filtering**: Filter by genre, release year, language, and rating
- **Detailed Statistics**: View comprehensive movie information including ratings, box office data, budget, cast, and reviews
- **Visual Analytics**: Interactive charts and graphs for movie performance analysis
- **Movie Comparison**: Side-by-side comparison of movies
- **User Accounts**: Registration, login, favorites, and custom reports
- **Admin Panel**: Complete administrative interface for system management

### 📊 Analytics & Visualization
- Genre distribution charts
- Year-based movie trends
- Rating distribution analysis
- Box office performance graphs
- User engagement metrics
- API usage statistics

### 🔐 User Management
- User registration and authentication
- Personal favorites management
- Custom data export
- Feedback system
- User preferences and settings

### 🛠️ Admin Features
- API configuration management
- User account management
- System monitoring and health checks
- Data export and backup
- Feedback management
- Cache and system maintenance

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Web browser with JavaScript enabled

### Quick Start

1. **Clone or Download the Project**
   ```bash
   cd /Users/partheeshreddy/Downloads/SE\ project
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure API Keys**
   
   Open `config.js` and replace the placeholder API keys:
   ```javascript
   TMDB: {
       API_KEY: 'YOUR_TMDB_API_KEY_HERE', // Get from https://www.themoviedb.org/settings/api
   },
   OMDB: {
       API_KEY: 'YOUR_OMDB_API_KEY_HERE', // Get from http://www.omdbapi.com/apikey.aspx
   }
   ```

4. **Start the Application**
   ```bash
   npm start
   ```

5. **Access the Application**
   - Main App: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin.html

### Getting API Keys

#### TMDb API Key
1. Visit [TMDb API](https://www.themoviedb.org/settings/api)
2. Create an account or log in
3. Request an API key
4. Copy the API key to `config.js`

#### OMDb API Key (Optional)
1. Visit [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. Request a free API key
3. Copy the API key to `config.js`

## Project Structure

```
SE project/
├── index.html              # Main application page
├── admin.html              # Admin panel page
├── styles.css              # Main stylesheet
├── config.js               # Configuration and API keys
├── api.js                  # API service and data fetching
├── auth.js                 # Authentication and user management
├── analytics.js            # Charts and analytics functionality
├── app.js                  # Main application logic
├── admin.js                # Admin panel functionality
├── package.json            # Project dependencies
└── README.md               # This file
```

## Usage Guide

### For Users

1. **Search Movies**
   - Use the search bar to find movies by title, actor, or director
   - Apply filters to narrow down results
   - Click on any movie card to view detailed information

2. **Create Account**
   - Click "Register" to create a new account
   - Log in to save favorites and access personalized features

3. **View Analytics**
   - Navigate to the Analytics section to see movie trends and statistics
   - Interactive charts show genre distribution, year trends, and ratings

4. **Compare Movies**
   - Go to the Compare section
   - Enter two movie titles to see side-by-side comparison

5. **Provide Feedback**
   - Use the Feedback section to share your thoughts and rate the application

### For Administrators

1. **Access Admin Panel**
   - Navigate to `/admin.html` or click "Admin Panel" in the main app
   - Use the sidebar to access different management sections

2. **Configure APIs**
   - Go to API Settings to configure TMDb and OMDb API keys
   - Test API connectivity to ensure proper configuration

3. **Monitor System**
   - View real-time system statistics in the Dashboard
   - Monitor API usage and system performance
   - Check system health and run diagnostics

4. **Manage Users**
   - View all registered users
   - Search and filter users
   - View user details and activity

5. **Export Data**
   - Export user data, analytics, feedback, and system logs
   - Create system backups for data protection

## API Integration

The application integrates with two major movie databases:

### TMDb (The Movie Database)
- Primary source for movie data
- Provides comprehensive movie information, cast, crew, and images
- Rate limit: 40 requests per 10 seconds (configurable)

### OMDb (Open Movie Database)
- Secondary source for additional movie details
- Provides IMDB ratings and additional metadata
- Rate limit: 1000 requests per day (free tier)

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (responsive design)

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure API keys are correctly set in `config.js`
   - Verify API keys are active and have proper permissions
   - Check browser console for specific error messages

2. **Search Not Working**
   - Check internet connection
   - Verify API keys are configured
   - Try refreshing the page

3. **Charts Not Displaying**
   - Ensure Chart.js library is loaded
   - Check browser console for JavaScript errors
   - Try refreshing the analytics section

4. **Admin Panel Access**
   - Ensure you're accessing `/admin.html`
   - Check that admin.js is properly loaded
   - Verify localStorage is enabled in your browser

### Performance Optimization

- The application uses caching to reduce API calls
- Images are loaded on-demand to improve initial load time
- Charts are rendered only when needed
- Search results are paginated for better performance

## Contributing

This is a demonstration project showcasing modern web development practices:

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: Chart.js for data visualization
- **APIs**: RESTful integration with TMDb and OMDb
- **Storage**: LocalStorage for user data and caching
- **Design**: Responsive, mobile-first design

## License

This project is created for educational and demonstration purposes. Please respect the terms of service of the integrated APIs (TMDb and OMDb).

## Support

For technical support or questions:
1. Check the browser console for error messages
2. Verify API keys are correctly configured
3. Ensure all dependencies are installed
4. Check network connectivity

---

**Note**: This application requires valid API keys from TMDb and optionally OMDb to function properly. The application is designed to work with real movie data and provides a comprehensive platform for movie analysis and discovery.
