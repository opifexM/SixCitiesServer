import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {ParamOfferId} from '#src/modules/offer/type/param-offerid.type.js';
import {CreateReviewDTO} from '#src/modules/review/dto/create-review.dto.js';
import {ReviewRDO} from '#src/modules/review/dto/review.rdo.js';
import {ReviewService} from '#src/modules/review/service/review-service.interface.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {BaseController} from '#src/rest/controller/base-controller.abstract.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {DocumentExistsMiddleware} from '#src/rest/middleware/document-exists.middleware.js';
import {PrivateRouteMiddleware} from '#src/rest/middleware/private-route.middleware.js';
import {ValidateDtoMiddleware} from '#src/rest/middleware/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '#src/rest/middleware/validate-objectid.middleware.js';
import {Component} from '#src/type/component.enum.js';
import {HttpMethod} from '#src/type/http-method.enum.js';
import {RequestBody} from '#src/type/request-body.type.js';
import {fillDTO} from '#src/utils/dto.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Ref} from '@typegoose/typegoose';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';


@injectable()
export class ReviewController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.ReviewService) private readonly reviewService: ReviewService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);
    this.logger.info('Register routes for ReviewController...');

    this.addRoute({
      method: HttpMethod.Get,
      path: '/:offerId',
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/:offerId',
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateReviewDTO),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });

  }

  public async show({params, query}: Request<ParamOfferId>, res: Response): Promise<void> {
    const offerIdRef = params.offerId as unknown as Ref<OfferEntity>;
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : undefined;

    if (limit && isNaN(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The \'limit\' parameter must be a valid number.',
        'ReviewController'
      );
    }

    const reviews = await this.reviewService.findByOffer(offerIdRef, limit);
    this.ok(res, fillDTO(ReviewRDO, reviews));
  }

  public async create(
    {body, tokenPayload, params}: Request<ParamOfferId, RequestBody, CreateReviewDTO>,
    res: Response
  ): Promise<void> {
    const authorIdRef = tokenPayload.id as unknown as Ref<UserEntity>;
    const offerIdRef = params.offerId as unknown as Ref<OfferEntity>;

    const createdReview = await this.reviewService.create(authorIdRef, offerIdRef, body);
    this.created(res, fillDTO(ReviewRDO, createdReview));
  }
}
