import {IsLatitude, IsLongitude} from 'class-validator';

export class LocationValidation {
  @IsLatitude()
  public latitude!: number;

  @IsLongitude()
  public longitude!: number;
}
