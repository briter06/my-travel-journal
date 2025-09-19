import { readdir } from 'fs/promises';

export const loadData = async () => {
  const files = await readdir("./places");
  for (const file of files) {
    console.log(file);
  }
};
