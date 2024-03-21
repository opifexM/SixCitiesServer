import {City} from '#src/modules/city/type/city.type.js';
import {CityValidation} from '#src/modules/city/validation/city-validation.js';
import {Location} from '#src/modules/location/type/location.type.js';
import {LocationValidation} from '#src/modules/location/validation/location-validation.js';
import {OfferType} from '#src/modules/offer/type/offer.type.js';
import {OFFER_VALIDATION_CONSTANT} from '#src/modules/offer/validation/offer-validation.constant.js';
import {User} from '#src/modules/user/type/user.type.js';
import {UserValidation} from '#src/modules/user/validation/user-validation.js';
import {Type} from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateNested
} from 'class-validator';


export class OfferValidation {
  @IsString()
  @Length(OFFER_VALIDATION_CONSTANT.TITLE.MIN_LENGTH, OFFER_VALIDATION_CONSTANT.TITLE.MAX_LENGTH)
  public title!: string;

  @IsString()
  @Length(OFFER_VALIDATION_CONSTANT.description.MIN_LENGTH, OFFER_VALIDATION_CONSTANT.description.MAX_LENGTH)
  public description!: string;

  @IsDateString()
  public publishDate!: Date;

  @ValidateNested()
  @Type(() => CityValidation)
  public city!: City;

  @IsUrl()
  public previewImage!: string;

  @IsArray()
  @ArrayMinSize(OFFER_VALIDATION_CONSTANT.IMAGES.MIN_COUNT)
  @ArrayMaxSize(OFFER_VALIDATION_CONSTANT.IMAGES.MAX_COUNT)
  @IsUrl({}, {each: true})
  public images!: string[];

  @IsBoolean()
  public isPremium!: boolean;

  @IsBoolean()
  public isFavorite!: boolean;

  @IsEnum(OfferType)
  public type!: OfferType;

  @IsNumber()
  @Min(OFFER_VALIDATION_CONSTANT.ROOM.MIN)
  @Max(OFFER_VALIDATION_CONSTANT.ROOM.MAX)
  public room!: number;

  @IsNumber()
  @Min(OFFER_VALIDATION_CONSTANT.BEDROOM.MIN)
  @Max(OFFER_VALIDATION_CONSTANT.BEDROOM.MAX)
  public bedroom!: number;

  @IsNumber()
  @Min(OFFER_VALIDATION_CONSTANT.PRICE.MIN)
  @Max(OFFER_VALIDATION_CONSTANT.PRICE.MAX)
  public price!: number;

  @IsArray()
  @IsString({each: true})
  public goods!: string[];

  @IsNumber({maxDecimalPlaces: 1})
  @Min(1)
  @Max(5)
  public rating!: number;

  @ValidateNested()
  @Type(() => UserValidation)
  public host!: User;

  @ValidateNested()
  @Type(() => LocationValidation)
  public location!: Location;

  @IsNumber()
  @Min(OFFER_VALIDATION_CONSTANT.VISITOR.MIN)
  @Max(OFFER_VALIDATION_CONSTANT.VISITOR.MAX)
  public visitor!: number;
}
