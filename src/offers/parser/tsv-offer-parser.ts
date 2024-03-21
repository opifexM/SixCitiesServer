import {Offer, OfferType} from '#src/modules/offer/type/offer.type.js';
import {UserType} from '#src/modules/user/type/user.type.js';
import {OfferParser} from '#src/offers/parser/offer-parser.interface.js';
import {injectable} from 'inversify';

@injectable()
export class TsvOfferParser implements OfferParser {

  private stringToBoolean(str: string) {
    return str === 'true';
  }

  public parserOffer(tsvString: string): Offer {
    const [title, description, publishDate, cityName, cityLocationLatitude, cityLocationLongitude,
      previewImage, images, isPremium, rating, type, room, bedroom, price, goods,
      hostName, hostEmail, hostAvatarUrl, hostPassword, hostType, offerLocationLatitude, offerLocationLongitude, visitor] = tsvString.split('\t');


    return {
      title,
      description,
      publishDate: new Date(publishDate),
      city: {
        name: cityName,
        location: {
          latitude: Number(cityLocationLatitude),
          longitude: Number(cityLocationLongitude)
        }
      },
      previewImage,
      images: images.split(';'),
      isPremium: this.stringToBoolean(isPremium),
      isFavorite: false,
      rating: Number(rating),
      type: type as OfferType,
      room: Number(room),
      bedroom: Number(bedroom),
      visitor: Number(visitor),
      price: Number(price),
      goods: goods.split(';'),
      host: {
        name: hostName,
        email: hostEmail,
        avatarUrl: hostAvatarUrl,
        password: hostPassword,
        type: hostType as UserType
      },
      location: {
        latitude: Number(offerLocationLatitude),
        longitude: Number(offerLocationLongitude)
      }
    };
  }
}


