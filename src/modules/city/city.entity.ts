import {City} from '#src/modules/city/type/city.type.js';
import {Location} from '#src/modules/location/type/location.type.js';
import {GeoLocation} from '#src/modules/schemas/geo.schema.js';
import {defaultClasses, getModelForClass, modelOptions, prop, Severity} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CityEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'cities',
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CityEntity extends defaultClasses.TimeStamps implements City {
  @prop({required: true, trim: true, unique: true})
  public name: string;

  @prop({required: true})
  public geoLocation: GeoLocation;

  public location: Location;

  constructor(cityData: City) {
    super();
    this.name = cityData.name;
    this.location = cityData.location;
    this.geoLocation = {
      type: 'Point',
      coordinates: [cityData.location.longitude, cityData.location.latitude]
    };
  }
}

export const CityModel = getModelForClass(CityEntity);
