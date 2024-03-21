import {CityController} from '#src/modules/city/city.controller.js';
import {CityEntity, CityModel} from '#src/modules/city/city.entity.js';
import {CityRepository} from '#src/modules/city/repository/city-repository.interface.js';
import {MongoCityRepository} from '#src/modules/city/repository/mongo-city.repository.js';
import {CityService} from '#src/modules/city/service/city-service.interface.js';
import {DefaultCityService} from '#src/modules/city/service/default-city.service.js';
import {Controller} from '#src/rest/controller/controller.interface.js';
import {Component} from '#src/type/component.enum.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createCityContainer(): Container {
  const cityContainer = new Container();
  cityContainer.bind<types.ModelType<CityEntity>>(Component.CityModel).toConstantValue(CityModel);
  cityContainer.bind<CityService>(Component.CityService).to(DefaultCityService).inSingletonScope();
  cityContainer.bind<CityRepository>(Component.CityRepository).to(MongoCityRepository).inSingletonScope();
  cityContainer.bind<Controller>(Component.CityController).to(CityController).inSingletonScope();

  return cityContainer;
}
