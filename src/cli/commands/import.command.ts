import {BaseCommand} from '#src/cli/commands/base-command.js';
import {CityService} from '#src/modules/city/service/city-service.interface.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {Offer} from '#src/modules/offer/type/offer.type.js';
import {UserService} from '#src/modules/user/service/user-service.interface.js';
import {OfferParser} from '#src/offers/parser/offer-parser.interface.js';
import {FileReader} from '#src/offers/reader/file-reader.interface.js';
import {Component} from '#src/type/component.enum.js';
import {DbParam} from '#src/type/db-param.type.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {DatabaseClient} from '#src/utils/database-client/database-client.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {inject, injectable} from 'inversify';

@injectable()
export class ImportCommand extends BaseCommand {
  protected readonly _name: string = '--import';

  private saveQueue: Promise<void> = Promise.resolve();

  constructor(
    @inject(Component.OfferParser) private readonly offerParser: OfferParser,
    @inject(Component.FileReader) private readonly fileReader: FileReader,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CityService) private readonly cityService: CityService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super();
  }

  public async execute(...parameters: string[]): Promise<void> {
    const {fileList, dbParam} = this.parseInput(parameters);
    this.validateInput(fileList);

    this.logger.info('Init database...');
    await this.initDb(dbParam);

    this.logger.info('Init database completed');
    await this.parseFileList(fileList);

    await this.saveQueue;
    await this.databaseClient.disconnect();
  }

  private parseInput(inputArgs: string[]): { fileList: string[], dbParam: DbParam } {
    const dbParamKeys: { [key: string]: keyof DbParam } = {
      '-u': 'dbUser',
      '-p': 'dbPassword',
      '-h': 'dbHost',
      '-P': 'dbPort',
      '-n': 'dbName',
    };

    const dbParam: Partial<DbParam> = {};
    const fileList: string[] = [];
    for (let i = 0; i < inputArgs.length; i++) {
      const arg = inputArgs[i];
      if (dbParamKeys[arg]) {
        const nextIndex = i + 1;
        if (nextIndex < inputArgs.length && !inputArgs[nextIndex].startsWith('-')) {
          const value = inputArgs[nextIndex];
          dbParam[dbParamKeys[arg]] = value;
          this.logger.info(`Read '${dbParamKeys[arg]}' from console: ${value}`);
          i++;
        } else {
          throw new Error(`Value for ${arg} is missing`);
        }
      }
    }

    inputArgs.forEach((arg) => {
      if (!arg.startsWith('-') && !Object.values(dbParam).includes(arg)) {
        fileList.push(arg);
      }
    });

    return {fileList, dbParam: dbParam as DbParam};
  }


  private validateInput(fileList: string[]): void {
    if (!fileList.length) {
      throw new Error('At least one "Filepath" is required.');
    }
    if (fileList.some((filePath) => !filePath.trim())) {
      throw new Error('All file paths must be non-empty strings.');
    }
  }

  private onImportedLine = (dataLine: string) => {
    const offerData = this.offerParser.parserOffer(dataLine);
    this.saveQueue = this.saveQueue.then(
      () => this.saveToBd(offerData),
      () => this.saveToBd(offerData)
    );
  };

  private onCompleteImport = (count: number) => {
    this.logger.info(`${count} rows import: `);
  };

  private async parseFileList(fileList: string[]): Promise<void> {
    for (const file of fileList) {
      this.fileReader.on('line', this.onImportedLine);
      this.fileReader.on('end', this.onCompleteImport);
      try {
        await this.fileReader.read(file);
      } catch {
        console.error(`Can't import data from file: ${file}`);
      }
    }
  }

  private async initDb(dbParams: DbParam): Promise<void> {
    const dbParamVerified: DbParam = {
      dbUser: dbParams.dbUser ?? this.config.get('DB_USER'),
      dbPassword: dbParams.dbPassword ?? this.config.get('DB_PASSWORD'),
      dbHost: dbParams.dbHost ?? this.config.get('DB_HOST'),
      dbPort: dbParams.dbPort ?? this.config.get('DB_PORT'),
      dbName: dbParams.dbName ?? this.config.get('DB_NAME')
    };
    const dbUri = this.databaseClient.getURI(dbParamVerified);

    return this.databaseClient.connect(
      dbUri,
      this.config.get('DB_RETRY_COUNT'),
      this.config.get('DB_RETRY_TIMEOUT')
    );
  }

  private async saveToBd(offerData: Offer): Promise<void> {
    const {city: offerCityData, host: offerUserData} = offerData;
    const offerCity = await this.cityService.findOrCreate(offerCityData);
    const offerUser = await this.userService.findOrCreate(offerUserData);
    const offer = await this.offerService.findOrCreate(offerData);
    this.logger.info(`Import to DB: city '${offerCity?.name}', user '${offerUser?.email}', offer '${offer?.title}'`);
  }
}
