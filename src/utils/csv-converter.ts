import { Worker } from 'node:worker_threads';
import { readdir } from 'node:fs/promises';
import { checkPath } from './checkPath';

export const csvConverter = async function (
  directory: string,
): Promise<string> {
  if (!(await checkPath(directory))) {
    return `Cannot access: ${directory}`;
  }
  const csvFiles: string[] = await readdir(directory);
  for (let i = 0; i < (csvFiles.length < 10 ? csvFiles.length : 10); i++) {
    new Worker(`${process.cwd()}/src/utils/csv-converter-worker.ts`, {
      env: {
        path: csvFiles[i],
        directory: directory,
      },
      execArgv: ['-r', 'ts-node/register'],
    });
  }
  return 'Csv files converted successfully';
};
