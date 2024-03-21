import {Command} from '#src/cli/commands/command.interface.js';
import {injectable} from 'inversify';

@injectable()
export abstract class BaseCommand implements Command {
  protected abstract _name: string;
  abstract execute(...parameters: string[]): void;

  get name(): string {
    return this._name;
  }
}
