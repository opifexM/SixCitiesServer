import {BaseCommand} from '#src/cli/commands/base-command.js';
import {parseJson} from '#src/utils/parse-json.js';
import {readFileAsync} from '#src/utils/read-file-async.js';
import {injectable} from 'inversify';

@injectable()
export class VersionCommand extends BaseCommand {
  protected readonly _name: string = '--version';
  private readonly filePath = './package.json';

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(await this.readVersion());
  }

  private isJsonConfig(obj: unknown): obj is {version?: string} {
    return typeof obj === 'object' && obj !== null && 'version' in obj;
  }

  private async readVersion(): Promise<string> {
    const rawFileContent = await readFileAsync(this.filePath);
    const fileConfig = parseJson(rawFileContent);
    if (!this.isJsonConfig(fileConfig) || typeof fileConfig.version !== 'string') {
      throw new Error(`'version' field is missing or not a string in the file at ${this.filePath}`);
    }
    return fileConfig.version;
  }
}

