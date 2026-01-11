// JSDOM-based unit tests for MovieStatsApp

const MovieStatsApp = require('../app');

// Global stubs used by app.js methods
beforeAll(() => {
    // Minimal CONFIG needed for debounce if referenced
    global.CONFIG = {
        APP: { DEBOUNCE_DELAY: 50 }
    };

    // Stubbed movieAPI to avoid network calls during constructor/init
    global.movieAPI = {
        getTrendingMovies: jest.fn().mockResolvedValue({ results: [] }),
        getTopRatedMovies: jest.fn().mockResolvedValue({ results: [] }),
        getPopularMovies: jest.fn().mockResolvedValue({ results: [] }),
        formatMovieData: jest.fn((m) => m),
        getImageUrl: jest.fn((path) => `https://img/${path}`),
        searchMovies: jest.fn().mockResolvedValue({ results: [] }),
        getMovieDetails: jest.fn().mockResolvedValue({
            id: 1,
            title: 'Test',
            release_date: '2020-01-01',
            runtime: 100,
            vote_average: 7.5,
            genres: [],
            popularity: 10,
            budget: 0,
            revenue: 0
        }),
        getPersonDetails: jest.fn().mockResolvedValue({
            id: 2,
            name: 'Person',
            movie_credits: { cast: [] }
        })
    };

    // Stubbed authManager for favorites and notifications
    global.authManager = {
        isFavorite: jest.fn().mockReturnValue(false),
        addToFavorites: jest.fn(),
        removeFromFavorites: jest.fn(),
        showNotification: jest.fn()
    };
});

function createAppWithDOM(domHtml = '') {
    document.body.innerHTML = domHtml;
    return new MovieStatsApp();
}

describe('MovieStatsApp UI helpers', () => {
    test('setupPagination renders buttons for current/prev/next', async () => {
        const app = createAppWithDOM('<div id="pagination"></div>');
        app.searchResults = { totalPages: 5 };
        app.currentPage = 3;

        app.setupPagination();

        const html = document.getElementById('pagination').innerHTML;
        expect(html).toContain('Previous');
        // current page should have class="active"
        expect(html).toContain('class="active"');
        expect(html).toContain('Next');
        // Should render a few page number buttons including the current page number
        expect(html).toMatch(/<button\s+class=\"active\"[\s\S]*>\s*3\s*<\/button>/);
    });

    test('setupPagination disables Prev on first page and Next on last page', () => {
        const app = createAppWithDOM('<div id="pagination"></div>');
        app.searchResults = { totalPages: 3 };

        app.currentPage = 1;
        app.setupPagination();
        let html = document.getElementById('pagination').innerHTML;
        expect(html).toMatch(/<button disabled[^>]*>\s*Previous\s*<\/button>/);

        app.currentPage = 3;
        app.setupPagination();
        html = document.getElementById('pagination').innerHTML;
        expect(html).toMatch(/<button disabled[^>]*>\s*Next\s*<\/button>/);
    });

    test('clearSearchResults empties containers and resets state', () => {
        const app = createAppWithDOM('<div id="searchResultsGrid">x</div><div id="pagination">y</div>');
        app.searchResults = { totalPages: 10 };
        app.currentPage = 5;

        app.clearSearchResults();

        expect(document.getElementById('searchResultsGrid').innerHTML).toBe('');
        expect(document.getElementById('pagination').innerHTML).toBe('');
        expect(app.currentPage).toBe(1);
        expect(Array.isArray(app.searchResults)).toBe(true);
        expect(app.searchResults.length).toBe(0);
    });
});

describe('MovieStatsApp grid/card generation', () => {
    test('createMoviesGrid wraps movie cards', () => {
        const app = createAppWithDOM();
        const movies = [
            { id: 1, title: 'A', year: 2020, genres: ['Drama'], rating: 8.0, posterPath: 'a.jpg' },
            { id: 2, title: 'B', year: 2021, genres: ['Action', 'Sci-Fi'], rating: 7.2, posterPath: '' }
        ];

        const html = app.createMoviesGrid(movies);
        expect(html).toContain('class="movies-grid"');
        expect(html).toContain('movie-card');
        expect(html).toContain('A');
        expect(html).toContain('B');
    });

    test('createMovieCard respects authManager.isFavorite for heart state', () => {
        const app = createAppWithDOM();
        authManager.isFavorite.mockReturnValueOnce(true);
        const movie = { id: 9, title: 'Fav', year: 2022, genres: ['Thriller'], rating: 9.1, posterPath: 'p.jpg' };
        const card = app.createMovieCard(movie);
        expect(card).toContain('favorite-btn active');
    });
});


