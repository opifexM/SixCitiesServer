export interface Command {
  execute(...parameters: string[]): void;
  get name(): string;
}
