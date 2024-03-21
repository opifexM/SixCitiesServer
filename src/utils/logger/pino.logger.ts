import {Logger} from '#src/utils/logger/logger.interface.js';
import {injectable} from 'inversify';
import {Logger as PinoInstance, pino} from 'pino';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    this.logger = pino({
      level: 'info',
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            level: 'debug',
            options: {
              colorize: true,
              translateTime: 'SYS:standard'
            }
          }
        ]
      }
    });
    this.logger.info('Logger created...');
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, error?: Error, ...args: unknown[]): void {
    if (error) {
      this.logger.error(error, message, ...args);
    } else {
      this.logger.error(message, ...args);
    }
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
