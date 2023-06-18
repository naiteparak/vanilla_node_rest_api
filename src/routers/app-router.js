import { ERROR_MESSAGES } from '../responses/messages.js';
import { STATUS_CODES } from '../responses/status-codes.js';
import { CONTENT_TYPES } from '../responses/content-types.js';
import { appController } from '../controllers/app-controller.js';

class AppRouter {
  async handleRoutes(req, res) {
    const { method, url } = req;
    if (method === 'POST' && url === '/exports') {
      return await appController.convertCsvFiles(req, res);
    } else if (method === 'GET' && url === '/files') {
      return await appController.getConvertedFiles(req, res);
    } else if (method === 'GET' && url.startsWith('/files/:')) {
      return await appController.getConvertedFileByName(req, res);
    } else if (method === 'DELETE' && url.startsWith('/files/:')) {
      return await appController.deleteConvertedFileByName(req, res);
    } else {
      return res
        .writeHead(STATUS_CODES.NOT_FOUND, CONTENT_TYPES.APPLICATION_JSON)
        .end(JSON.stringify({ error: ERROR_MESSAGES.ENDPOINT_NOT_FOUND }));
    }
  }
}

export const appRouter = new AppRouter();
