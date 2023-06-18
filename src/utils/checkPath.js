import { access } from 'node:fs/promises';

export const checkPath = async function (path) {
  try {
    await access(path);
    return true;
  } catch (err) {
    return false;
  }
};
