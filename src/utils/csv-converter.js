import { Worker, isMainThread } from 'node:worker_threads';
import { createReadStream, createWriteStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import csv from 'csv-parser';
import { checkPath } from './checkPath.js';

export const csvConverter = async function (path) {
  const startTime = new Date();

  if (isMainThread) {
    await checkPath(path);
    const csvFiles = await readdir(path);
    for (let i = 0; i < (csvFiles.length < 10 ? csvFiles.length : 10); i++) {
      new Worker(`${process.cwd()}/csv-converter`, {
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
      `${process.cwd()}/../csv-files/${process.env.path}`,
    );
    const writableStream = createWriteStream(
      `${process.cwd()}/../converted/${process.env.path.split('csv')[0]}.json`,
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
};
