// __tests__/app.search.test.js

describe('MovieStatsApp - performSearch', () => {
    let MovieStatsApp;

    beforeAll(() => {
        global.CONFIG = { APP: { DEBOUNCE_DELAY: 10 } };
    });

    beforeEach(() => {
        jest.resetModules();
        document.body.innerHTML = `
            <div id="searchResultsGrid"></div>
            <div id="pagination"></div>
            <div id="loadingSpinner" style="display:none"></div>
            <section id="searchResults"></section>
        `;

        // JSDOM doesn't implement scrollIntoView
        if (!Element.prototype.scrollIntoView) {
            Element.prototype.scrollIntoView = jest.fn();
        }

        global.authManager = {
            showNotification: jest.fn(),
            isFavorite: jest.fn().mockReturnValue(false)
        };

        global.movieAPI = {
            combinedSearch: jest.fn().mockResolvedValue({
                movies: [ { id: 1, title: 'M1', year: 2021, genres: ['Drama'], rating: 8.2, posterPath: '' } ],
                people: [ { id: 2, name: 'P1', popularity: 10, profilePath: '' } ],
                totalPages: 2,
                totalResults: 2
            }),
            getImageUrl: jest.fn(),
            formatMovieData: jest.fn(),
            getTrendingMovies: jest.fn().mockResolvedValue({ results: [] }),
            getTopRatedMovies: jest.fn().mockResolvedValue({ results: [] }),
            getPopularMovies: jest.fn().mockResolvedValue({ results: [] }),
            handleAPIError: jest.fn().mockReturnValue('Search failed')
        };

        jest.isolateModules(() => {
            MovieStatsApp = require('../app');
        });
    });

    test('performSearch populates results and shows pagination', async () => {
        const app = new MovieStatsApp();
        app.currentQuery = 'star';
        await app.performSearch();

        const gridHtml = document.getElementById('searchResultsGrid').innerHTML;
        expect(gridHtml).toContain('Movies');
        expect(gridHtml).toContain('People');
        expect(document.getElementById('pagination').innerHTML).toContain('Next');
        expect(movieAPI.combinedSearch).toHaveBeenCalledWith('star', 1);
    });
});


