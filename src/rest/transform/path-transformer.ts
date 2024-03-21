import {SERVER_CONFIG} from '#src/rest/config.constant.js';
import {Component} from '#src/type/component.enum.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {getFullServerPath} from '#src/utils/server-path.js';
import {inject, injectable} from 'inversify';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

@injectable()
export class PathTransformer {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    this.logger.info('Register PathTransformer');
  }

  public transform(data: Record<string, unknown>): Record<string, unknown> {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (SERVER_CONFIG.STATIC_RESOURCE_FIELDS.includes(key)) {
        if (Array.isArray(value)) {
          data[key] = value.map((item) => typeof item === 'string' ? this.transformPath(item) : item);
        } else if (typeof value === 'string') {
          data[key] = this.transformPath(value);
        }
      } else if (isObject(value)) {
        this.transform(value);
      }
    });

    return data;
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const transformedData = JSON.parse(JSON.stringify(data));
    return this.transform(transformedData);
  }

  private transformPath(value: string): string {
    const rootPath = SERVER_CONFIG.DEFAULT_STATIC_IMAGES.includes(value)
      ? SERVER_CONFIG.STATIC_FILES_ROUTE
      : SERVER_CONFIG.STATIC_UPLOAD_ROUTE;
    return `${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}${rootPath}/${value}`;
  }
}
