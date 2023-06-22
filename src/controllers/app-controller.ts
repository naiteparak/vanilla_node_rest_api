import { getReqBody } from '../utils/get-req-body';
import { ERROR_MESSAGES } from '../responses/messages';
import { STATUS_CODES } from '../responses/status-codes';
import { CONTENT_TYPES } from '../responses/content-types';
import { appService } from '../services/app-service';
import { checkPath } from '../utils/checkPath';
import { IncomingMessage, ServerResponse } from 'http';
import { IDirReqBody } from '../interfaces/dir-req-body-interface';
import { IPerson } from '../interfaces/persone';

class AppController {
  async convertCsvFiles(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<ServerResponse> {
    try {
      const reqBody: IDirReqBody = await getReqBody(req);
      const directory: string = reqBody.directory;
      if (!directory) {
        return res
          .writeHead(STATUS_CODES.BAD_REQUEST, {
            'Content-Type': CONTENT_TYPES.APPLICATION_JSON,
          })
          .end(
            JSON.stringify({ error: ERROR_MESSAGES.DIRECTORY_FIELD_REQUIRED }),
          );
      }
      const message: string = await appService.convertCsvFiles(directory);
      return res
        .writeHead(STATUS_CODES.CREATED, {
          'Content-Type': CONTENT_TYPES.APPLICATION_JSON,
        })
        .end(JSON.stringify({ response: message }));
    } catch (error) {
      return res
        .writeHead(STATUS_CODES.INTERNAL_SERVER_ERROR, {
          'Content-Type': CONTENT_TYPES.APPLICATION_JSON,
        })
        .end(JSON.stringify({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }));
    }
  }

  async getConvertedFiles(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<ServerResponse> {
    try {
      const csvFiles: string[] = await appService.getConvertedFiles();
      return res
        .writeHead(STATUS_CODES.OK, {
          'Content-Type': CONTENT_TYPES.APPLICATION_JSON,
        })
        .end(JSON.stringify({ response: csvFiles }));
    } catch (error) {
      return res
        .writeHead(STATUS_CODES.INTERNAL_SERVER_ERROR, {
          'Content-Type': CONTENT_TYPES.APPLICATION_JSON,
        })
        .end(JSON.stringify({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR }));
    }
  }

  async getConvertedFileByName(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<ServerResponse> {
    const fileName = req.url?.split('/files/:')[1];

    const filePath = `${process.cwd()}/src/converted/${fileName}`;
    if (!(await checkPath(filePath))) {
      return res
        .writeHead(STATUS_CODES.BAD_REQUEST, {
          'Content-Type': CONTENT_TYPES.APPLICATION_JSON,
        })
        .end(JSON.stringify({ response: ERROR_MESSAGES.FILE_DOES_NOT_EXISTS }));
    }

    const people: IPerson[] = await appService.getFileByPath(filePath);
    return res
      .writeHead(STATUS_CODES.OK, {
        'Content-Type': CONTENT_TYPES.APPLICATION_JSON,
      })
      .end(JSON.stringify({ response: people }));
  }

  async deleteConvertedFileByName(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<ServerResponse> {
    const fileName = req.url?.split('/files/:')[1];

    const filePath = `${process.cwd()}/src/converted/${fileName}`;
    if (!(await checkPath(filePath))) {
      return res
        .writeHead(STATUS_CODES.BAD_REQUEST, {
          'Content-Type': CONTENT_TYPES.APPLICATION_JSON,
        })
        .end(JSON.stringify({ response: ERROR_MESSAGES.FILE_DOES_NOT_EXISTS }));
    }

    await appService.deleteFileByPath(filePath);
    return res
      .writeHead(STATUS_CODES.NO_CONTENT, {
        'Content-Type': CONTENT_TYPES.APPLICATION_JSON,
      })
      .end();
  }
}

export const appController = new AppController();
