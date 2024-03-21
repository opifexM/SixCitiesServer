import {HttpError} from '#src/rest/errors/http-error.js';
import {Middleware} from '#src/rest/middleware/middleware.interface.js';
import {MongooseObjectId} from '#src/type/mongoose-objectid.type.js';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private param: string) {
  }

  public execute({params}: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (MongooseObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `'${objectId}' is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
