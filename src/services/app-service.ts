import { csvConverter } from '../utils/csv-converter';
import { readdir } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { unlink } from 'fs/promises';
import { IPerson } from '../interfaces/persone';

class AppService {
  async convertCsvFiles(directory: string): Promise<string> {
    return await csvConverter(directory);
  }

  async getConvertedFiles(): Promise<string[]> {
    return await readdir(`${process.cwd()}/src/converted`);
  }

  async getFileByPath(filePath: string): Promise<IPerson[]> {
    return new Promise((resolve): void => {
      const readStream = createReadStream(filePath);
      let json = '';
      readStream.on('data', (chunk): void => {
        json += chunk;
      });
      readStream.on('end', (): void => {
        resolve(JSON.parse(json));
      });
    });
  }

  async deleteFileByPath(filePath: string): Promise<void> {
    await unlink(filePath);
  }
}

export const appService = new AppService();
