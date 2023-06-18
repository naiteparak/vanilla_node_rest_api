import { csvConverter } from '../utils/csv-converter.js';
import { readdir } from 'node:fs/promises';

class AppService {
  async convertCsvFiles(directory) {
    return await csvConverter(directory);
  }

  async getCsvFiles() {
    return await readdir(`${process.cwd()}/src/converted`);
  }
}

export const appService = new AppService();
