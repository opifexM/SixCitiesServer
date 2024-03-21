import {City} from '#src/modules/city/type/city.type.js';
import {Location} from '#src/modules/location/type/location.type.js';
import {OfferType} from '#src/modules/offer/type/offer.type.js';
import {UserType} from '#src/modules/user/type/user.type.js';

export interface MockServerData {
  titles: string[];
  descriptions: string[];
  cities: City[];
  previewImages: string[];
  images: string[];
  isPremium: boolean[];
  isFavorite: boolean[];
  types: OfferType[];
  goods: string[];
  hostNames: string[];
  hostEmails: string[];
  hostAvatarUrls: string[];
  hostPasswords: string[];
  hostTypes: UserType[];
  locations: Location[];
}
