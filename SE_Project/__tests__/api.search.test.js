// __tests__/api.search.test.js

describe('MovieAPI - combinedSearch and error handling', () => {
    let MovieAPI;

    beforeAll(() => {
        global.CONFIG = {
            APP: { CACHE_DURATION: 1000 },
            TMDB: {
                BASE_URL: 'https://example.com',
                API_KEY: 'fake',
                IMAGE_BASE_URL: 'https://img/',
                IMAGE_SIZES: { POSTER: '/w500', PROFILE: '/w185' }
            },
            GENRES: { 1: 'Action', 2: 'Drama' },
            ERRORS: {
                NETWORK_ERROR: 'Network error',
                UNAUTHORIZED: 'Unauthorized',
                MOVIE_NOT_FOUND: 'Movie not found',
                RATE_LIMIT_EXCEEDED: 'Rate limit',
                INVALID_RESPONSE: 'Invalid response'
            }
        };
    });

    beforeEach(() => {
        jest.resetModules();
        global.fetch = jest.fn();
        jest.isolateModules(() => {
            MovieAPI = require('../api');
        });
    });

    test('combinedSearch merges and formats results with totals', async () => {
        const api = new MovieAPI();

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    results: [
                        { id: 10, title: 'A', vote_average: 7, vote_count: 100, popularity: 12, poster_path: '/a.jpg', release_date: '2020-01-01', genre_ids: [1, 2], original_language: 'en' }
                    ],
                    total_pages: 5,
                    total_results: 100
                })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    results: [{ id: 20, name: 'Person A', profile_path: '/p.jpg', popularity: 7 }],
                    total_pages: 3,
                    total_results: 30
                })
            });

        const result = await api.combinedSearch('batman', 1);

        expect(result.totalPages).toBe(5);
        expect(result.totalResults).toBe(130);
        expect(result.movies[0]).toMatchObject({ id: 10, title: 'A', genres: ['Action', 'Drama'] });
        expect(result.people[0]).toMatchObject({ id: 20, name: 'Person A', profilePath: '/p.jpg' });
    });

    test('handleAPIError maps errors to messages', () => {
        const api = new MovieAPI();
        expect(api.handleAPIError(new Error('401'))).toBe('Unauthorized');
        expect(api.handleAPIError(new Error('404'))).toBe('Movie not found');
        expect(api.handleAPIError(new Error('429'))).toBe('Rate limit');
        expect(api.handleAPIError(new Error('Invalid'))).toBe('Invalid response');
    });
});


