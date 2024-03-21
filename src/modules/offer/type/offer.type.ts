import {City} from '#src/modules/city/type/city.type.js';
import {Location} from '#src/modules/location/type/location.type.js';
import {User} from '#src/modules/user/type/user.type.js';

export enum OfferType {
  apartment = 'apartment',
  room = 'room',
  house = 'house',
  hotel = 'hotel'
}

export interface Offer {
  title: string,
  description: string,
  publishDate: Date,
  city: City,
  previewImage: string,
  images: string[],
  isPremium: boolean,
  isFavorite: boolean,
  rating: number,
  type: OfferType,
  room: number,
  bedroom: number,
  price: number,
  goods: string[],
  host: User,
  location: Location,
  visitor: number
}
