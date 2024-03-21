import {CityEntity} from '#src/modules/city/city.entity.js';
import {Location} from '#src/modules/location/type/location.type.js';
import {OfferDTO} from '#src/modules/offer/dto/offer.dto.js';
import {OfferType} from '#src/modules/offer/type/offer.type.js';
import {GeoLocation} from '#src/modules/schemas/geo.schema.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {defaultClasses, getModelForClass, modelOptions, prop, Ref, Severity} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({required: true, trim: true, unique: true})
  public title: string;

  @prop({required: true, enum: OfferType})
  public type: OfferType;

  @prop({required: true})
  public bedroom: number;

  @prop({required: true, ref: () => CityEntity})
  public cityId: Ref<CityEntity>;

  @prop({required: true, trim: true})
  public description: string;

  @prop({required: true, type: [String]})
  public goods: string[];

  @prop({required: true, ref: () => UserEntity})
  public hostId: Ref<UserEntity>;

  @prop({required: true, type: [String]})
  public images: string[];

  @prop({required: true})
  public isPremium: boolean;

  @prop({required: true})
  public geoLocation: GeoLocation;

  public location: Location;

  @prop({required: true})
  public previewImage: string;

  @prop({required: true})
  public price: number;

  @prop({required: true})
  public publishDate: Date;

  @prop({required: true})
  public room: number;

  @prop({required: true})
  public rating: number = 0;

  @prop({required: true})
  public reviewCount: number = 0;

  @prop({required: true})
  public visitor: number;

  constructor(
    offerData: OfferDTO,
    cityId: Ref<CityEntity>,
    hostId: Ref<UserEntity>,
  ) {
    super();
    this.bedroom = offerData.bedroom;
    this.description = offerData.description;
    this.goods = offerData.goods;
    this.images = offerData.images;
    this.isPremium = offerData.isPremium;
    this.location = offerData.location;
    this.previewImage = offerData.previewImage;
    this.price = offerData.price;
    this.publishDate = offerData.publishDate;
    this.room = offerData.room;
    this.visitor = offerData.visitor;
    this.title = offerData.title;
    this.type = offerData.type;
    this.cityId = cityId;
    this.hostId = hostId;
    this.geoLocation = {
      type: 'Point',
      coordinates: [offerData.location.longitude, offerData.location.latitude]
    };
  }
}

export const OfferModel = getModelForClass(OfferEntity);
