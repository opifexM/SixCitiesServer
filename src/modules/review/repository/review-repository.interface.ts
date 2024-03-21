import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {ReviewEntity} from '#src/modules/review/review.entity.js';
import {MongooseObjectId} from '#src/type/mongoose-objectid.type.js';
import {DocumentType, Ref} from '@typegoose/typegoose';

export interface ReviewRepository {
  create(reviewData: ReviewEntity): Promise<DocumentType<ReviewEntity>>;

  findById(reviewId: string): Promise<DocumentType<ReviewEntity> | null>;

  findByOfferAndComment(offerId: Ref<OfferEntity>, reviewComment: string): Promise<DocumentType<ReviewEntity> | null>;

  findByOffer(offerIdRef: Ref<OfferEntity>, limit: number): Promise<DocumentType<ReviewEntity>[]>;

  exists(reviewId: MongooseObjectId): Promise<boolean>;

  calculateAverageRating(offerIdRef: Ref<OfferEntity>): Promise<number>;
}
