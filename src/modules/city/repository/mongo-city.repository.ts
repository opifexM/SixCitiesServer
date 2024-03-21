import {CityEntity} from '#src/modules/city/city.entity.js';
import {CityRepository} from '#src/modules/city/repository/city-repository.interface.js';
import {Component} from '#src/type/component.enum.js';
import {MongooseObjectId} from '#src/type/mongoose-objectid.type.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

@injectable()
export class MongoCityRepository implements CityRepository {
  constructor(
    @inject(Component.CityModel) private cityModel: types.ModelType<CityEntity>,
  ) {
  }

  public async create(cityData: CityEntity): Promise<DocumentType<CityEntity>> {
    return this.cityModel.create(cityData);
  }

  public async findById(cityId: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findById(cityId);
  }

  public async findByName(cityName: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({name: cityName});
  }

  public async find(limit: number): Promise<DocumentType<CityEntity>[]> {
    return this.cityModel.find({}, {}, {limit: limit});
  }

  public async exists(cityId: MongooseObjectId): Promise<boolean> {
    const isCityExists = await this.cityModel.exists({_id: cityId});
    return !!isCityExists;
  }
}
