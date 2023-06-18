import { ERROR_MESSAGES } from '../responses/messages.js';
import { STATUS_CODES } from '../responses/status-codes.js';

class AppRouter {
  handleRoutes(method, url, req, res) {
    if (method === 'POST' && url === '/exports') {
      console.log(1);
    } else if (method === 'GET' && url === '/files') {
    } else if (method === 'GET' && url.startsWith('/files/:')) {
      const filename = url.substring('/files/'.length);
    } else if (method === 'DELETE' && url.startsWith('/files/:')) {
      const filename = url.substring('/files/'.length);
    } else {
      return res
        .writeHead(STATUS_CODES.NOT_FOUND, {
          'Content-Type': 'application/json',
        })
        .end(JSON.stringify({ error: ERROR_MESSAGES.ENDPOINT_NOT_FOUND }));
    }
  }
}

export const appRouter = new AppRouter();
