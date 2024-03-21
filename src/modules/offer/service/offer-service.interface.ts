import {CreateOfferDTO} from '#src/modules/offer/dto/create-offer.dto.js';
import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {Offer} from '#src/modules/offer/type/offer.type.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {DocumentExists} from '#src/rest/middleware/document-exists.interface.js';
import {Ref} from '@typegoose/typegoose';

export interface OfferService extends DocumentExists {
  create(hostIdRef: Ref<UserEntity>, offerParams: CreateOfferDTO): Promise<Offer>;

  findOrCreate(offerData: Offer): Promise<Offer>;

  findShort(userIdRef?: Ref<UserEntity>, cityId?: string, requestedLimit?: number): Promise<OfferEntity[]>;

  findFullById(offerIdRef: Ref<OfferEntity>, userIdRef?: Ref<UserEntity>): Promise<OfferEntity | null>

  exists(offerId: string): Promise<boolean>;

  findById(offerIdRef: Ref<OfferEntity>): Promise<OfferEntity | null>;

  updateDetailById(offerIdRef: Ref<OfferEntity>, hostIdRef: Ref<UserEntity>, offerData: Partial<Offer>): Promise<Offer>;

  updateImageById(offerIdRef: Ref<OfferEntity>, hostIdRef: Ref<UserEntity>, offerData: Partial<Offer>): Promise<Offer>;

  deleteById(offerIdRef: Ref<OfferEntity>, hostIdRef: Ref<UserEntity>): Promise<Offer>;

  getIdRefByTitle(offerTitle: string): Promise<Ref<OfferEntity> | null>;

  findPremiumByCity(cityName: string, requestedLimit?: number): Promise<OfferEntity[]>;

  findByIdList(offerIds: Ref<OfferEntity>[], limit: number): Promise<OfferEntity[]>;

  incrementReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean>;

  setRating(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean>;

  findFavorites(userIdRef: Ref<UserEntity>, requestedLimit?: number): Promise<OfferEntity[]>;
}
