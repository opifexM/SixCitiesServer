import {TokenPayload} from '#src/modules/auth/type/token-payload.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Middleware} from '#src/rest/middleware/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {jwtVerify} from 'jose';

function isTokenPayload(payload: unknown): payload is TokenPayload {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const safePayload = payload as Record<string, unknown>;
  const hasEmail = typeof safePayload.email === 'string';
  const hasId = typeof safePayload.id === 'string';

  return hasEmail && hasId;
}

export class ParseTokenMiddleware implements Middleware {
  constructor(private readonly jwtSecret: string) {
  }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }
    const [, token] = authorizationHeader;

    try {
      const {payload} = await jwtVerify(token, Buffer.from(this.jwtSecret));

      if (isTokenPayload(payload)) {
        req.tokenPayload = {...payload};
        return next();
      } else {
        throw new Error('Bad token');
      }
    } catch {

      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticateMiddleware')
      );
    }
  }
}
