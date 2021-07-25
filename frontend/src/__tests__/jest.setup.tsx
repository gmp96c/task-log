import { setupServer } from 'msw/node';
import { handlers } from './handlers';
import '@testing-library/jest-dom';

try {
    const server = setupServer(...handlers);
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    test('1 + 1 = 2', () => {
        expect(1 + 1).toEqual(2);
    });
} catch (err) {
    console.error(err);
}
