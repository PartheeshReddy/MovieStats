// __tests__/auth.login.test.js

describe('AuthManager - login/register', () => {
    let AuthManager;

    beforeAll(() => {
        global.CONFIG = {
            STORAGE: { USER_DATA: 'movieStats_userData' }
        };
    });

    beforeEach(() => {
        document.body.innerHTML = `<div class="user-auth"></div><div id="authModal"></div>`;
        localStorage.clear();
        global.movieAPI = { getMovieDetails: jest.fn() };
        global.authManager = undefined;
        jest.resetModules();
        jest.isolateModules(() => {
            AuthManager = require('../auth');
        });
    });

    test('registerUser stores user and returns public profile', async () => {
        const manager = new AuthManager();

        const user = await manager.registerUser({
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'secret123'
        });

        expect(user).toEqual({
            id: expect.any(String),
            name: 'Jane Doe',
            email: 'jane@example.com',
            joinDate: expect.any(String)
        });

        const savedUsers = JSON.parse(localStorage.getItem('movieStats_users'));
        expect(savedUsers).toHaveLength(1);
        expect(savedUsers[0].email).toBe('jane@example.com');
    });

    test('authenticateUser succeeds for correct credentials', async () => {
        const manager = new AuthManager();

        localStorage.setItem(
            'movieStats_users',
            JSON.stringify([
                { id: '1', name: 'John', email: 'john@example.com', password: 'abc123', joinDate: new Date().toISOString() }
            ])
        );

        const user = await manager.authenticateUser('john@example.com', 'abc123');
        expect(user).toMatchObject({ name: 'John', email: 'john@example.com' });
    });

    test('handleLogin shows error for wrong password', async () => {
        jest.useFakeTimers();
        const manager = new AuthManager();

        localStorage.setItem(
            'movieStats_users',
            JSON.stringify([
                { id: '1', name: 'John', email: 'john@example.com', password: 'correct', joinDate: new Date().toISOString() }
            ])
        );

        const notify = jest.spyOn(manager, 'showNotification').mockImplementation(() => {});

        document.body.innerHTML = `
            <form id="loginForm"></form>
            <input id="loginEmail" value="john@example.com" />
            <input id="loginPassword" value="wrong" />
            <div class="user-auth"></div>
            <div id="authModal"></div>
        `;

        const event = { preventDefault: jest.fn() };
        const promise = manager.handleLogin(event);
        jest.runOnlyPendingTimers();
        await promise;

        expect(notify).toHaveBeenCalledWith('Invalid credentials', 'error');
    });
});


