import {CityDTO} from './city.dto';
import {LocationDTO} from './location.dto';
import {OfferTypeDTO} from './offer-type.dto';

export class CreateOfferDTO {
  public title!: string;
  public description!: string;
  public city!: CityDTO;
  public previewImage?: string;
  public isPremium!: boolean;
  public type!: OfferTypeDTO;
  public room?: number;
  public bedroom!: number;
  public visitor!: number;
  public price!: number;
  public goods!: string[];
  public location!: LocationDTO;
  public images?: string[];
}
