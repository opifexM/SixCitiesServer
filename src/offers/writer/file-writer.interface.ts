export interface FileWriter {
  write(row: string): Promise<void>;
  createStream(filename: string): void;
}
