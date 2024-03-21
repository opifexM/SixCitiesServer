import {Middleware} from '#src/rest/middleware/middleware.interface.js';
import {HttpMethod} from '#src/type/http-method.enum.js';
import {NextFunction, Request, Response} from 'express';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
}
