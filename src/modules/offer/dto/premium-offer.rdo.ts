import {CityRDO} from '#src/modules/city/dto/city.rdo.js';
import {City} from '#src/modules/city/type/city.type.js';
import {Location} from '#src/modules/location/type/location.type.js';
import {OfferType} from '#src/modules/offer/type/offer.type.js';
import {UserRDO} from '#src/modules/user/dto/user.rdo.js';
import {User} from '#src/modules/user/type/user.type.js';
import {Expose, Transform, Type} from 'class-transformer';

export class PremiumOfferRDO {
  @Expose()
  public id!: string;

  @Expose()
  public bedroom!: number;

  @Expose({name: 'cityId'})
  @Type(() => CityRDO)
  public city!: City;

  @Expose()
  public description!: string;

  @Expose()
  public goods!: string[];

  @Expose({name: 'hostId'})
  @Type(() => UserRDO)
  public host!: User;

  @Expose()
  public images!: string[];

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  @Transform(({obj}) => ({
    latitude: obj.geoLocation.coordinates[1],
    longitude: obj.geoLocation.coordinates[0]
  }))
  public location!: Location;

  @Expose()
  public previewImage!: string;

  @Expose()
  public price!: number;

  @Expose()
  public publishDate!: Date;

  @Expose()
  public rating!: number;

  @Expose()
  public room!: number;

  @Expose()
  public title!: string;

  @Expose()
  public type!: OfferType;

  @Expose()
  public visitor!: number;
}
