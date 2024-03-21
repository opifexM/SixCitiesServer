import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {CreateReviewDTO} from '#src/modules/review/dto/create-review.dto.js';
import {ReviewDTO} from '#src/modules/review/dto/review.dto.js';
import {ReviewRepository} from '#src/modules/review/repository/review-repository.interface.js';
import {ReviewEntity} from '#src/modules/review/review.entity.js';
import {ReviewService} from '#src/modules/review/service/review-service.interface.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {LIST_LIMITS_CONFIG} from '#src/rest/config.constant.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Component} from '#src/type/component.enum.js';
import {MongooseObjectId} from '#src/type/mongoose-objectid.type.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {validateAndResolveLimit} from '#src/utils/validator.js';
import {Ref} from '@typegoose/typegoose';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';

@injectable()
export class DefaultReviewService implements ReviewService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.ReviewRepository) private readonly reviewRepository: ReviewRepository,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
  }

  public async create(authorIdRef: Ref<UserEntity>, offerIdRef: Ref<OfferEntity>, reviewParams: CreateReviewDTO): Promise<ReviewEntity> {
    const commentTrimmed = reviewParams.comment.trim();
    const existingReview = await this.reviewRepository.findByOfferAndComment(offerIdRef, commentTrimmed);
    if (existingReview) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `A review with the same text already exists for offer ID '${offerIdRef.toString()}'.`,
        'ReviewService'
      );
    }
    const reviewData: ReviewDTO = {
      ...reviewParams,
      publishDate: new Date(),
    };

    const reviewCreationResult = await this.createReviewInternal(authorIdRef, offerIdRef, reviewData);
    const createdReview = await this.findById(reviewCreationResult.id);
    if (!createdReview) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `An unknown error occurred error creating review for offer ID '${offerIdRef.toString()}' and user ID '${authorIdRef.toString()}.`,
        'ReviewService'
      );
    }

    return createdReview;
  }

  public async calculateAndSetRating(offerIdRef: Ref<OfferEntity>): Promise<boolean> {
    const averageRating = await this.reviewRepository.calculateAverageRating(offerIdRef);

    const isOfferRatingUpdated = await this.offerService.setRating(offerIdRef, averageRating);
    if (!isOfferRatingUpdated) {
      this.logger.error(`Can't update review count for offer ID '${offerIdRef.toString()}'`);
      return false;
    }

    return true;
  }

  public async findByOffer(offerIdRef: Ref<OfferEntity>, requestedLimit?: number): Promise<ReviewEntity[]> {
    const limit = validateAndResolveLimit(LIST_LIMITS_CONFIG.REVIEW_LIST_LIMIT, 'ReviewService', requestedLimit);
    const offerReviews = await this.reviewRepository.findByOffer(offerIdRef, limit);

    this.logger.info(`Completed search for reviews for offer '${offerIdRef.toString()}'. Found ${offerReviews.length} reviews.`);
    return offerReviews;
  }

  public async findById(reviewId: string): Promise<ReviewEntity | null> {
    if (!MongooseObjectId.isValid(reviewId)) {
      return null;
    }

    return this.reviewRepository.findById(reviewId);
  }

  public async exists(reviewId: string): Promise<boolean> {
    if (!MongooseObjectId.isValid(reviewId)) {
      return false;
    }

    const objectId = new MongooseObjectId(reviewId);
    return this.reviewRepository.exists(objectId);
  }

  private async createReviewInternal(authorIdRef: Ref<UserEntity>, offerIdRef: Ref<OfferEntity>, reviewData: ReviewDTO): Promise<ReviewEntity> {
    try {
      const review = new ReviewEntity(authorIdRef, offerIdRef, reviewData);
      const createdReview = await this.reviewRepository.create(review);

      if (!await this.offerService.incrementReviewCount(offerIdRef)) {
        this.logger.error(`Can't update review count for offer ID '${offerIdRef.toString()}'`);
      }
      if (!await this.calculateAndSetRating(offerIdRef)) {
        this.logger.error(`Can't calculate rating for offer ID '${offerIdRef.toString()}'`);
      }

      this.logger.info(`New [review] with publish date '${review.publishDate}' created`);
      return createdReview;
    } catch (error) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error creating review for offer ID '${offerIdRef.toString()}' and user ID '${authorIdRef.toString()}. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`,
        'ReviewService'
      );
    }
  }
}
