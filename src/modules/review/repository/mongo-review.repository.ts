import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {ReviewRepository} from '#src/modules/review/repository/review-repository.interface.js';
import {ReviewEntity} from '#src/modules/review/review.entity.js';
import {Component} from '#src/type/component.enum.js';
import {MongooseObjectId} from '#src/type/mongoose-objectid.type.js';
import {DocumentType, Ref, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

@injectable()
export class MongoReviewRepository implements ReviewRepository {
  constructor(
    @inject(Component.ReviewModel) private reviewModel: types.ModelType<ReviewEntity>,
  ) {
  }

  public async create(reviewData: ReviewEntity): Promise<DocumentType<ReviewEntity>> {
    return this.reviewModel.create(reviewData);
  }

  public async findById(reviewId: string): Promise<DocumentType<ReviewEntity> | null> {
    return this.reviewModel
      .findById(reviewId)
      .populate({
        path: 'offerId',
        populate: [
          {
            path: 'hostId',
            model: 'UserEntity'
          },
          {
            path: 'cityId',
            model: 'CityEntity'
          }
        ]
      })
      .populate('authorId');
  }

  public async findByOfferAndComment(offerId: Ref<OfferEntity>, reviewComment: string): Promise<DocumentType<ReviewEntity> | null> {
    return this.reviewModel
      .findOne({
        offerId: offerId,
        comment: reviewComment,
      })
      .populate(['authorId', 'offerId']);
  }

  public async findByOffer(offerIdRef: Ref<OfferEntity>, limit: number): Promise<DocumentType<ReviewEntity>[]> {
    return this.reviewModel
      .find({offerId: offerIdRef}, {}, {limit: limit})
      .sort({publishDate: -1})
      .populate({
        path: 'offerId',
        populate: [
          {
            path: 'hostId',
            model: 'UserEntity'
          },
          {
            path: 'cityId',
            model: 'CityEntity'
          }
        ]
      })
      .populate('authorId');
  }

  public async exists(reviewId: MongooseObjectId): Promise<boolean> {
    const isReviewExists = await this.reviewModel.exists({_id: reviewId});
    return !!isReviewExists;
  }

  public async calculateAverageRating(offerIdRef: Ref<OfferEntity>): Promise<number> {
    const objectId = new MongooseObjectId(offerIdRef.toString());
    const result = await this.reviewModel.aggregate([
      {
        $match: {offerId: objectId}
      },
      {
        $group: {
          _id: '$offerId',
          averageRating: {$avg: '$rating'},
        },
      },
      {
        $project: {
          _id: 0,
          averageRating: 1,
        }
      }
    ]);

    return result.length > 0 ? result[0].averageRating : 0;
  }

  // public async calculateAverageRating(offerIdRef: Ref<OfferEntity>): Promise<{
  //   _id: Ref<OfferEntity>;
  //   averageRating: number;
  // }[]> {
  //   const objectId = new MongooseObjectId(offerIdRef.toString());
  //   return this.reviewModel.aggregate([
  //     {
  //       $match: {offerId: objectId}
  //     },
  //     {
  //       $group: {
  //         _id: '$offerId',
  //         averageRating: {$avg: '$rating'},
  //       },
  //     },
  //   ]);
  // }
}
