import {readFile} from 'node:fs/promises';
import path from 'node:path';

async function readFileAsync(filePath: string): Promise<string> {
  try {
    const resolvedFilePath = path.resolve(filePath);
    return readFile(resolvedFilePath, 'utf8');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error reading file at ${filePath}: ${error.message}`);
      throw error;
    } else {
      throw new Error(`An unknown error occurred while reading file at '${filePath}'.`);
    }
  }
}

export {readFileAsync};
