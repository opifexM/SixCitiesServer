import {CITY_VALIDATION_CONSTANT} from '#src/modules/city/validation/city-validation.constant.js';
import {LocationValidation} from '#src/modules/location/validation/location-validation.js';
import {Type} from 'class-transformer';
import {IsString, Length, ValidateNested} from 'class-validator';

export class CityValidation {
  @IsString()
  @Length(CITY_VALIDATION_CONSTANT.NAME.MIN_LENGTH, CITY_VALIDATION_CONSTANT.NAME.MAX_LENGTH)
  public name!: string;

  @ValidateNested()
  @Type(() => LocationValidation)
  public location!: LocationValidation;
}
