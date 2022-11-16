/* eslint-disable @typescript-eslint/ban-ts-comment */
import { server } from '../mocks/server';

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen();
});

global.console = {
  ...global.console,
  warn: jest.fn(),
};

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => {
  server.close();
});
