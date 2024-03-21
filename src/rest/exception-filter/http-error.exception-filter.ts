import {createErrorObject} from '#src/rest/errors/error.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {ApplicationError} from '#src/rest/errors/type/application-error.enum.js';
import {ExceptionFilter} from '#src/rest/exception-filter/exception-filter.interface.js';
import {Component} from '#src/type/component.enum.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`, error);
    res
      .status(error.httpStatusCode ?? StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.CommonError, error.message, [], error.detail));
  }
}
