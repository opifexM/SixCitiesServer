import {CityDTO} from './city.dto';
import {LocationDTO} from './location.dto';
import {OfferTypeDTO} from './offer-type.dto';
import {UserDTO} from './user.dto';

export class OfferDTO {
  public id!: string;
  public title!: string;
  public description!: string;
  public city!: CityDTO;
  public isPremium!: boolean;
  public type!: OfferTypeDTO;
  public room!: number;
  public bedroom!: number;
  public price!: number;
  public goods!: string[];
  public location!: LocationDTO;
  public publishDate!: Date;
  public previewImage!: string;
  public images!: string[];
  public rating!: number;
  public isFavorite!: boolean;
  public visitor!: number;
  public host!: UserDTO;
}
