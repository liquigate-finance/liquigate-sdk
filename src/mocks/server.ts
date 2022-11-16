import { setupServer } from 'msw/node';
import { rest } from 'msw';

// This configures a request mocking server with the given request handlers.
export const server = setupServer(
  rest.get('/public/locales/en-US', (req, res, ctx) => {
    return res(ctx.json({ greeting: 'hello there' }));
  })
);
