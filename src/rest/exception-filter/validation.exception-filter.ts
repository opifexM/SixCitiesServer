import {createErrorObject} from '#src/rest/errors/error.js';
import {ApplicationError} from '#src/rest/errors/type/application-error.enum.js';
import {ValidationError} from '#src/rest/errors/validation.error.js';
import {ExceptionFilter} from '#src/rest/exception-filter/exception-filter.interface.js';
import {Component} from '#src/type/component.enum.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationException]: ${error.message}`, error);
    error.details.forEach(
      (errorField) => this.logger.warn(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.ValidationError, error.message, error.details));
  }
}
