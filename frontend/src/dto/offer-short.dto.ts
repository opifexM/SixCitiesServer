import {CityDTO} from './city.dto';
import {LocationDTO} from './location.dto';
import {OfferTypeDTO} from './offer-type.dto';

export class OfferShortDTO {
  public id!: string;
  public title!: string;
  public city!: CityDTO;
  public isPremium!: boolean;
  public type!: OfferTypeDTO;
  public price!: number;
  public location!: LocationDTO;
  public previewImage!: string;
  public rating!: number;
  public isFavorite!: boolean;
}
