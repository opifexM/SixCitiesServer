import {appendFile} from 'node:fs/promises';
import path from 'node:path';

async function saveFileAsync(filePath: string, data: string): Promise<void> {
  try {
    const resolvedFilePath = path.resolve(filePath);
    return appendFile(resolvedFilePath, `${data}\n`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error append file at ${filePath}: ${error.message}`);
      throw error;
    } else {
      throw new Error(`An unknown error occurred while append file at '${filePath}'.`);
    }
  }
}

export {saveFileAsync};
