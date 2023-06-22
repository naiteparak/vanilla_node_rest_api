import { IncomingMessage } from 'http';
import { IDirReqBody } from '../interfaces/dir-req-body-interface';

export const getReqBody = function (
  req: IncomingMessage,
): Promise<IDirReqBody> {
  return new Promise((resolve): void => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      resolve(JSON.parse(body));
    });
  });
};
