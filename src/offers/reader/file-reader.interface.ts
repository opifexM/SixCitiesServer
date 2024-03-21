import EventEmitter from 'node:events';

export interface FileReader extends EventEmitter {
  read(filename: string): Promise<void>;
}
