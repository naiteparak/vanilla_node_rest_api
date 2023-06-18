import { csvConverter } from '../utils/csv-converter.js';

class AppService {
  async convertCsvFiles(directory) {
    return await csvConverter(directory);
  }
}

export const appService = new AppService();
