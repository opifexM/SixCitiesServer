import {HttpError} from '#src/rest/errors/http-error.js';
import {DocumentExists} from '#src/rest/middleware/document-exists.interface.js';
import {Middleware} from '#src/rest/middleware/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

export class DocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {
  }

  public async execute({params}: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with '${documentId}' not found.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
