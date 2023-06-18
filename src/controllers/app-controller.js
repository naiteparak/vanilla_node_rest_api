import { getReqBody } from '../utils/get-req-body.js';
import { ERROR_MESSAGES } from '../responses/messages.js';
import { STATUS_CODES } from '../responses/status-codes.js';
import { CONTENT_TYPES } from '../responses/content-types.js';
import { appService } from '../services/app-service.js';

class AppController {
  async convertCsvFiles(req, res) {
    try {
      const reqBody = await getReqBody(req);
      const directory = reqBody.directory;
      if (!directory) {
        res
          .writeHead(STATUS_CODES.BAD_REQUEST, CONTENT_TYPES.APPLICATION_JSON)
          .end(
            JSON.stringify({ error: ERROR_MESSAGES.DIRECTORY_FIELD_REQUIRED }),
          );
      }
      const result = await appService.convertCsvFiles(directory);
      res
        .writeHead(STATUS_CODES.CREATED, CONTENT_TYPES.APPLICATION_JSON)
        .end(JSON.stringify({ message: result }));
    } catch (error) {
      res
        .writeHead(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          CONTENT_TYPES.APPLICATION_JSON,
        )
        .end(JSON.stringify({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }));
    }
  }
}

export const appController = new AppController();
