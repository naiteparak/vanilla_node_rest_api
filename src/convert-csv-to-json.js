import { Worker, isMainThread } from 'node:worker_threads';
import { createReadStream, createWriteStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import csv from 'csv-parser';

class CsvParser {
  async parseCsv(path) {
    const startTime = new Date();

    if (isMainThread) {
      const csvFiles = await readdir(path);
      for (let i = 0; i < (csvFiles.length < 10 ? csvFiles.length : 10); i++) {
        new Worker(process.cwd(), {
          env: {
            path: csvFiles[i],
          },
        });
      }

      process.on('exit', () => {
        console.log(`Parsing duration is: ${new Date() - startTime}ms`);
      });
    } else {
      const result = [];

      const readableStream = createReadStream(
        `${process.cwd()}/src/csv-files/${process.env.path}`,
      );
      const writableStream = createWriteStream(
        `${process.cwd()}/src/converted/myFile.json`,
      );

      readableStream
        .pipe(csv())
        .on('data', (data) => {
          result.push(data);
        })
        .on('end', () => {
          writableStream.write(JSON.stringify(result));
          writableStream.end();
        })
        .on('close', () => {
          process.exit();
        });
    }
  }
}

const csvParser = new CsvParser();
await csvParser.parseCsv(`${process.cwd()}/src/csv-files`);
