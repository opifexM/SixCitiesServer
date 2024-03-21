import {Offer} from '#src/modules/offer/type/offer.type.js';

export interface OfferParser {
  parserOffer(data: string): Offer;
}
