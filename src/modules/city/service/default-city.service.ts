import {CityEntity} from '#src/modules/city/city.entity.js';
import {CityRepository} from '#src/modules/city/repository/city-repository.interface.js';
import {CityService} from '#src/modules/city/service/city-service.interface.js';
import {City} from '#src/modules/city/type/city.type.js';
import {LIST_LIMITS_CONFIG} from '#src/rest/config.constant.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Component} from '#src/type/component.enum.js';
import {MongooseObjectId} from '#src/type/mongoose-objectid.type.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {validateAndResolveLimit} from '#src/utils/validator.js';
import {Ref} from '@typegoose/typegoose';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';


@injectable()
export class DefaultCityService implements CityService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CityRepository) private readonly cityRepository: CityRepository,
  ) {
  }

  public async findById(cityId: string): Promise<CityEntity | null> {
    if (!MongooseObjectId.isValid(cityId)) {
      return null;
    }
    return this.cityRepository.findById(cityId);
  }

  public async find(requestedLimit?: number): Promise<CityEntity[]> {
    const limit = validateAndResolveLimit(LIST_LIMITS_CONFIG.CITY_LIST_LIMIT, 'CityService', requestedLimit);
    const cities = await this.cityRepository.find(limit);

    this.logger.info(`Retrieving all cities. Found ${cities.length} cities.`);
    return cities;
  }

  public async findOrCreate(cityData: City): Promise<CityEntity> {
    const cityNameTrimmed = cityData.name.trim();
    const existedCity = await this.cityRepository.findByName(cityNameTrimmed);

    return existedCity ?? await this.createCityInternal(cityData);
  }

  private async createCityInternal(cityData: City): Promise<CityEntity> {
    try {
      const city = new CityEntity(cityData);
      const createdCity = await this.cityRepository.create(city);

      this.logger.info(`New [city] created: ${city.name}`);
      return createdCity;

    } catch (error) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error creating city '${cityData.name}'. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`,
        'CityService'
      );
    }
  }

  public async getIdRefByName(cityName: string): Promise<Ref<CityEntity> | null> {
    const cityNameTrimmed = cityName.trim();
    const foundCity = await this.cityRepository.findByName(cityNameTrimmed);

    return foundCity?.id ?? null;
  }

  public async exists(cityId: string): Promise<boolean> {
    if (!MongooseObjectId.isValid(cityId)) {
      return false;
    }

    const objectId = new MongooseObjectId(cityId);
    return this.cityRepository.exists(objectId);
  }

  public async findByName(cityName: string): Promise<CityEntity | null> {
    const cityNameTrimmed = cityName.trim();
    const foundCity = await this.cityRepository.findByName(cityNameTrimmed);

    return foundCity ?? null;
  }
}
