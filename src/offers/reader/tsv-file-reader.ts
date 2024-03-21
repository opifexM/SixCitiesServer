import {FileReader} from '#src/offers/reader/file-reader.interface.js';
import {decorate, injectable} from 'inversify';
import EventEmitter from 'node:events';
import {createReadStream} from 'node:fs';

decorate(injectable(), EventEmitter);

@injectable()
export class TsvFileReader extends EventEmitter implements FileReader {
  private readonly chunkSize = 16384;

  public async read(filename: string): Promise<void> {
    const readStream = createReadStream(filename.trim(), {
      highWaterMark: this.chunkSize
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        this.emit('line', completeRow.trim());
      }
    }

    this.emit('end', importedRowCount);
  }
}


