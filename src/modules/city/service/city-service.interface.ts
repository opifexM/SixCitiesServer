import {CityEntity} from '#src/modules/city/city.entity.js';
import {City} from '#src/modules/city/type/city.type.js';
import {DocumentExists} from '#src/rest/middleware/document-exists.interface.js';
import {Ref} from '@typegoose/typegoose';

export interface CityService extends DocumentExists {
  findOrCreate(cityData: City): Promise<CityEntity>;

  find(requestedLimit?: number): Promise<CityEntity[]>;

  findByName(cityName: string): Promise<CityEntity | null>;

  getIdRefByName(cityName: string): Promise<Ref<CityEntity> | null>;

  exists(cityId: string): Promise<boolean>;

  findById(cityId: string): Promise<CityEntity | null>;
}
