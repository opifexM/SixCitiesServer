import {CityDTO} from './city.dto';
import {LocationDTO} from './location.dto';
import {OfferTypeDTO} from './offer-type.dto';
import {UserDTO} from './user.dto';

export class UpdateOfferDTO {
  public id?: string;
  public rating?: number;
  public isFavorite?: boolean;
  public room?: number;
  public previewImage?: string;
  public images?: string[];

  public price?: number;
  public title?: string;
  public isPremium?: boolean;
  public city?: CityDTO;
  public location?: LocationDTO;
  public type?: OfferTypeDTO;
  public bedroom?: number;
  public description?: string;
  public goods?: string[];
  public host?: UserDTO;
  public visitor?: number;
}

