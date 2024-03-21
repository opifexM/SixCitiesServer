import {createErrorObject} from '#src/rest/errors/error.js';
import {ApplicationError} from '#src/rest/errors/type/application-error.enum.js';
import {ExceptionFilter} from '#src/rest/exception-filter/exception-filter.interface.js';
import {Component} from '#src/type/component.enum.js';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';
import pino from 'pino';
import Logger = pino.Logger;

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(`[AppException]: ${error.message}`, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
