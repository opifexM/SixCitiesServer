import {Controller} from '#src/rest/controller/controller.interface.js';
import {Route} from '#src/rest/controller/route.interface.js';
import {PathTransformer} from '#src/rest/transform/path-transformer.js';
import {Component} from '#src/type/component.enum.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Response, Router} from 'express';
import asyncHandler from 'express-async-handler';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';

@injectable()
export abstract class BaseController implements Controller {
  private readonly _router: Router = Router();
  private readonly defaultContentType = 'application/json';

  @inject(Component.PathTransformer)
  private pathTransformer!: PathTransformer;

  constructor(
    protected readonly logger: Logger,
  ) {
  }

  get router(): Router {
    return this._router;
  }

  public addRoute(route: Route): void {
    const wrapperAsyncHandler = asyncHandler(route.handler.bind(this));
    const middlewareHandlers = route.middlewares?.map(
      (item) => asyncHandler(item.execute.bind(item))
    );
    const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrapperAsyncHandler] : wrapperAsyncHandler;

    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    const modifiedData = this.pathTransformer.execute(data as Record<string, unknown>);
    res
      .type(this.defaultContentType)
      .status(statusCode)
      .json(modifiedData);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
