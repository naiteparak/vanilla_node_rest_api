import { Worker, isMainThread } from 'node:worker_threads';
import { createReadStream, createWriteStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import csv from 'csv-parser';
import { checkPath } from './checkPath.js';

export const csvConverter = async function (directory) {
  if (isMainThread) {
    if (!(await checkPath(directory))) {
      return `Cannot access: ${directory}`;
    }
    const csvFiles = await readdir(directory);
    for (let i = 0; i < (csvFiles.length < 10 ? csvFiles.length : 10); i++) {
      new Worker(`${process.cwd()}/src/utils/csv-converter`, {
        env: {
          path: csvFiles[i],
          directory: directory,
        },
      });
    }
    return 'Csv files converted successfully';
  } else {
    const result = [];
    const readableStream = createReadStream(
      `${process.env.directory}/${process.env.path}`,
    );
    const writableStream = createWriteStream(
      `${process.cwd()}/src/converted/${process.env.path.split('csv')[0]}json`,
    );
    readableStream
      .pipe(csv())
      .on('data', (data) => {
        result.push(data);
      })
      .on('end', () => {
        writableStream.write(JSON.stringify(result));
        writableStream.end();
      });
  }
};

await csvConverter();
