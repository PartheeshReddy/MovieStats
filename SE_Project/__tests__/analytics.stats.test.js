// __tests__/analytics.stats.test.js

describe('MovieAnalytics - stats helpers', () => {
    let MovieAnalytics;

    beforeAll(() => {
        global.CONFIG = {
            CHARTS: {
                COLORS: {
                    PRIMARY: '#3b82f6',
                    SECONDARY: '#6366f1',
                    SUCCESS: '#10b981',
                    WARNING: '#f59e0b',
                    DANGER: '#ef4444',
                    INFO: '#0ea5e9'
                },
                OPTIONS: { responsive: true, plugins: {} }
            }
        };

        global.movieAPI = { getMovieStatistics: jest.fn().mockResolvedValue({ trending: [], topRated: [], popular: [] }) };
        global.Chart = function () { return { destroy: () => {} }; };
        global.authManager = { showNotification: jest.fn() };
    });

    beforeEach(() => {
        jest.resetModules();
        document.body.innerHTML = `
            <canvas id="genreChart"></canvas>
            <canvas id="yearChart"></canvas>
            <canvas id="ratingChart"></canvas>
            <canvas id="boxOfficeChart"></canvas>
            <div id="loadingSpinner"></div>
        `;
        jest.isolateModules(() => {
            MovieAnalytics = require('../analytics');
        });
    });

    test('calculateAverageRating returns 2 decimals', () => {
        const analytics = new MovieAnalytics();
        analytics.movieData = [ { rating: 8 }, { rating: 7.5 }, { rating: 6.25 } ];
        expect(analytics.calculateAverageRating()).toBe(((8 + 7.5 + 6.25) / 3).toFixed(2));
    });

    test('getTopGenres counts and sorts', () => {
        const analytics = new MovieAnalytics();
        analytics.movieData = [
            { genres: ['Drama', 'Action'] },
            { genres: ['Drama'] },
            { genres: ['Action'] },
            { genres: ['Comedy'] }
        ];
        const top = analytics.getTopGenres();
        expect(top[0]).toEqual({ genre: 'Drama', count: 2 });
        expect(top.find(g => g.genre === 'Action')?.count).toBe(2);
    });

    test('getYearDistribution aggregates by year', () => {
        const analytics = new MovieAnalytics();
        analytics.movieData = [ { year: 2022 }, { year: 2022 }, { year: 2021 } ];
        const dist = analytics.getYearDistribution();
        expect(dist).toEqual(expect.arrayContaining([
            { year: 2022, count: 2 },
            { year: 2021, count: 1 }
        ]));
    });
});


