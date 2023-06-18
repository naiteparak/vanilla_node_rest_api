import { getReqBody } from '../utils/get-req-body.js';
import { ERROR_MESSAGES } from '../responses/messages.js';
import { STATUS_CODES } from '../responses/status-codes.js';
import { CONTENT_TYPES } from '../responses/content-types.js';
import { appService } from '../services/app-service.js';
import { checkPath } from '../utils/checkPath.js';

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
      const message = await appService.convertCsvFiles(directory);
      res
        .writeHead(STATUS_CODES.CREATED, CONTENT_TYPES.APPLICATION_JSON)
        .end(JSON.stringify({ response: message }));
    } catch (error) {
      res
        .writeHead(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          CONTENT_TYPES.APPLICATION_JSON,
        )
        .end(JSON.stringify({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }));
    }
  }

  async getConvertedFiles(req, res) {
    try {
      const csvFiles = await appService.getConvertedFiles();
      res
        .writeHead(STATUS_CODES.OK, CONTENT_TYPES.APPLICATION_JSON)
        .end(JSON.stringify({ response: csvFiles }));
    } catch (error) {
      res
        .writeHead(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          CONTENT_TYPES.APPLICATION_JSON,
        )
        .end(JSON.stringify({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }));
    }
  }

  async getConvertedFileByName(req, res) {
    const fileName = req.url.split('/files/:')[1];

    const filePath = `${process.cwd()}/src/converted/${fileName}`;
    if (!(await checkPath(filePath))) {
      res
        .writeHead(STATUS_CODES.BAD_REQUEST, CONTENT_TYPES.APPLICATION_JSON)
        .end(JSON.stringify({ response: ERROR_MESSAGES.FILE_DOES_NOT_EXISTS }));
    }

    const json = await appService.getConvertedFileByPath(filePath);
    res
      .writeHead(STATUS_CODES.OK, CONTENT_TYPES.APPLICATION_JSON)
      .end(JSON.stringify({ response: json }));
  }
}

export const appController = new AppController();
