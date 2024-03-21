import {CityRDO} from '#src/modules/city/dto/city.rdo.js';
import {City} from '#src/modules/city/type/city.type.js';
import {Location} from '#src/modules/location/type/location.type.js';
import {OfferType} from '#src/modules/offer/type/offer.type.js';
import {Expose, Transform, Type} from 'class-transformer';

export class ShortOfferRDO {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public price!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public publishDate!: Date;

  @Expose({name: 'city'})
  @Type(() => CityRDO)
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public rating!: number;

  @Expose()
  @Transform(({obj}) => ({
    latitude: obj.geoLocation.coordinates[1],
    longitude: obj.geoLocation.coordinates[0]
  }))
  public location!: Location;
}
