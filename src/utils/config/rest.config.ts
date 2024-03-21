import {Component} from '#src/type/component.enum.js';
import {Config} from '#src/utils/config/config.interface.js';
import {configRestSchema, RestSchema} from '#src/utils/config/rest.schema.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {config} from 'dotenv';
import {inject, injectable} from 'inversify';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    const result = config();
    if (result.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }
    configRestSchema.load({});
    configRestSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configRestSchema.getProperties();
    this.logger.info('".env" file found and successfully parsed');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
