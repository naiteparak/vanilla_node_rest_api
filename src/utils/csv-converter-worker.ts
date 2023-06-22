import csv from 'csv-parser';
import { createReadStream, createWriteStream } from 'node:fs';
function csvConverterWorker(): void {
  const result: string[] = [];
  const readableStream = createReadStream(
    `${process.env.directory}/${process.env.path}`,
  );
  const writableStream = createWriteStream(
    `${process.cwd()}/src/converted/${process.env.path}.json`,
  );
  readableStream
    .pipe(csv())
    .on('data', (data: string): void => {
      result.push(data);
    })
    .on('end', (): void => {
      writableStream.write(JSON.stringify(result));
      writableStream.end();
    });
}

csvConverterWorker();
