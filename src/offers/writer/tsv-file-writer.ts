import {FileWriter} from '#src/offers/writer/file-writer.interface.js';
import {injectable} from 'inversify';
import {createWriteStream, WriteStream} from 'node:fs';

@injectable()
export class TsvFileWriter implements FileWriter {
  private stream?: WriteStream;

  createStream(filename: string): void {
    this.stream = createWriteStream(filename, {
      flags: 'w',
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.stream) {
      throw new Error('Stream not initialized. Call createStream first.');
    }

    const stream = this.stream;
    const writeSuccess = this.stream.write(`${row}\n`);
    if (!writeSuccess) {
      await new Promise<void>((resolve) => {
        stream.once('drain', () => resolve());
      });
    }
  }
}
