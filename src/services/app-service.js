import { csvConverter } from '../utils/csv-converter.js';
import { readdir } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { unlink } from 'fs/promises';

class AppService {
  async convertCsvFiles(directory) {
    return await csvConverter(directory);
  }

  async getConvertedFiles() {
    return await readdir(`${process.cwd()}/src/converted`);
  }

  async getFileByPath(filePath) {
    return new Promise((resolve, reject) => {
      const readStream = createReadStream(filePath);
      let json = '';
      readStream.on('data', (chunk) => {
        json += chunk;
      });
      readStream.on('end', () => {
        resolve(JSON.parse(json));
      });
    });
  }

  async deleteFileByPath(filePath) {
    await unlink(filePath);
  }
}

export const appService = new AppService();
