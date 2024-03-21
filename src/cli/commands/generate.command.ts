import {BaseCommand} from '#src/cli/commands/base-command.js';
import {OfferGenerator} from '#src/offers/generator/offer-generator.interface.js';
import {FileWriter} from '#src/offers/writer/file-writer.interface.js';
import {Component} from '#src/type/component.enum.js';
import {MockServerData} from '#src/type/mock-server-data.type.js';
import {loadDataAsync} from '#src/utils/load-data-async.js';
import {inject, injectable} from 'inversify';

@injectable()
export class GenerateCommand extends BaseCommand {
  protected readonly _name: string = '--generate';
  private readonly requiredParameters = 3;

  constructor(
    @inject(Component.OfferGenerator) private readonly offerGenerator: OfferGenerator,
    @inject(Component.FileWriter) private readonly fileWriter: FileWriter
  ) {
    super();
  }

  public async execute(...parameters: string[]): Promise<void> {
    this.validateParameters(parameters);
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);
    await this.generateOffers(offerCount, filepath, url);
  }

  private validateParameters(parameters: string[]): void {
    if (parameters.length !== this.requiredParameters) {
      throw new Error(`Incorrect number of parameters: found ${parameters.length}, expecting 3. The required parameters are "count", "filepath", and "url".`);
    }
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    if (isNaN(offerCount) || offerCount <= 0) {
      throw new Error(`Invalid "count": "${count}". Count should be a positive number.`);
    }
    if (!filepath.trim()) {
      throw new Error('"Filepath" is required and cannot be empty.');
    }

    if (!url.trim()) {
      throw new Error('"URL" is required and cannot be empty.');
    }
    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid "URL": "${url}". Please provide a valid URL.`);
    }
  }

  private async generateOffers(offerCount: number, filepath: string, url: string): Promise<void> {
    try {
      const mockServerData = await loadDataAsync<MockServerData>(url);
      this.fileWriter.createStream(filepath);
      for (let i = 0; i < offerCount; i++) {
        const offer = this.offerGenerator.generate(mockServerData);
        await this.fileWriter.write(offer);
      }
      console.info(`TSV File '${filepath}' was created with ${offerCount} offers.`);
    } catch {
      console.error(`Can't generate data for ${filepath} with ${url}`);
    }
  }
}
