import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {ReviewDTO} from '#src/modules/review/dto/review.dto.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ReviewEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'reviews',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ReviewEntity extends defaultClasses.TimeStamps {
  @prop({required: true, ref: UserEntity})
  public authorId: Ref<UserEntity>;

  @prop({required: true, ref: () => OfferEntity})
  public offerId: Ref<OfferEntity>;

  @prop({required: true, trim: true})
  public comment: string;

  @prop({required: true})
  public publishDate: Date;

  @prop({required: true})
  public rating: number;

  constructor(
    authorId: Ref<UserEntity>,
    offerId: Ref<OfferEntity>,
    reviewData: ReviewDTO,
  ) {
    super();
    this.comment = reviewData.comment;
    this.publishDate = reviewData.publishDate;
    this.rating = reviewData.rating;
    this.authorId = authorId;
    this.offerId = offerId;
  }
}

export const ReviewModel = getModelForClass(ReviewEntity);
