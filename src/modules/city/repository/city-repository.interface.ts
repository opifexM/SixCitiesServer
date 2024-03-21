import {CityEntity} from '#src/modules/city/city.entity.js';
import {MongooseObjectId} from '#src/type/mongoose-objectid.type.js';
import {DocumentType} from '@typegoose/typegoose';

export interface CityRepository {
  create(cityData: CityEntity): Promise<DocumentType<CityEntity>>;

  findById(cityId: string): Promise<DocumentType<CityEntity> | null>;

  findByName(cityName: string): Promise<DocumentType<CityEntity> | null>;

  find(limit: number): Promise<DocumentType<CityEntity>[]>;

  exists(cityId: MongooseObjectId): Promise<boolean>;
}
