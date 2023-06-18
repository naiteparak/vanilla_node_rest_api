import { access, constants } from 'node:fs/promises';

export const checkPath = async function (path) {
  try {
    await access(path);
  } catch (err) {
    console.error(`Cannot access: ${err.path}`);
    process.exit();
  }
};
