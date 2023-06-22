import { ERROR_MESSAGES } from '../responses/messages';
import { STATUS_CODES } from '../responses/status-codes';
import { CONTENT_TYPES } from '../responses/content-types';
import { appController } from '../controllers/app-controller';
import { IncomingMessage, ServerResponse } from 'http';
import { IMethodAndUrl } from '../interfaces/method-and-url-interface';

class AppRouter {
  async handleRoutes(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<ServerResponse> {
    const { method, url }: Partial<IMethodAndUrl> = req;
    if (method === 'POST' && url === '/exports') {
      return await appController.convertCsvFiles(req, res);
    } else if (method === 'GET' && url === '/files') {
      return await appController.getConvertedFiles(req, res);
    } else if (method === 'GET' && url?.startsWith('/files/:')) {
      return await appController.getConvertedFileByName(req, res);
    } else if (method === 'DELETE' && url?.startsWith('/files/:')) {
      return await appController.deleteConvertedFileByName(req, res);
    } else {
      return res
        .writeHead(STATUS_CODES.NOT_FOUND, {
          'Content-Type': CONTENT_TYPES.APPLICATION_JSON,
        })
        .end(JSON.stringify({ error: ERROR_MESSAGES.ENDPOINT_NOT_FOUND }));
    }
  }
}

export const appRouter = new AppRouter();
