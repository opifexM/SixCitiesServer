import {CityRDO} from '#src/modules/city/dto/city.rdo.js';
import {CityService} from '#src/modules/city/service/city-service.interface.js';
import {BaseController} from '#src/rest/controller/base-controller.abstract.js';
import {Component} from '#src/type/component.enum.js';
import {HttpMethod} from '#src/type/http-method.enum.js';
import {fillDTO} from '#src/utils/dto.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';

@injectable()
export class CityController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CityService) private readonly cityService: CityService,
  ) {
    super(logger);

    this.logger.info('Register routes for CityController...');
    this.addRoute({
      method: HttpMethod.Get,
      path: '/',
      handler: this.index
    });

  }

  public async index({query}: Request, res: Response): Promise<void> {
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : undefined;

    const cities = await this.cityService.find(limit);
    this.ok(res, fillDTO(CityRDO, cities));
  }
}
