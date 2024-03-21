import {BaseCommand} from '#src/cli/commands/base-command.js';
import {readFileAsync} from '#src/utils/read-file-async.js';
import chalk from 'chalk';
import {injectable} from 'inversify';

@injectable()
export class HelpCommand extends BaseCommand {
  protected readonly _name: string = '--help';
  private readonly filePath = './src/cli/help.txt';

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.green(await this.readHelp()));
  }

  private async readHelp(): Promise<string> {
    return readFileAsync(this.filePath);
  }
}
