import {CreateOfferDTO} from '#src/modules/offer/dto/create-offer.dto.js';
import {OfferRDO} from '#src/modules/offer/dto/offer.rdo.js';
import {PremiumOfferRDO} from '#src/modules/offer/dto/premium-offer.rdo.js';
import {ShortOfferRDO} from '#src/modules/offer/dto/short-offer.rdo.js';
import {UpdateOfferDTO} from '#src/modules/offer/dto/update-offer.dto.js';
import {UploadOfferImageRDO} from '#src/modules/offer/dto/upload-offer-image.rdo.js';
import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {ParamOfferId} from '#src/modules/offer/type/param-offerid.type.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {BaseController} from '#src/rest/controller/base-controller.abstract.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {DocumentExistsMiddleware} from '#src/rest/middleware/document-exists.middleware.js';
import {PrivateRouteMiddleware} from '#src/rest/middleware/private-route.middleware.js';
import {UploadFileMiddleware} from '#src/rest/middleware/upload-file.middleware.js';
import {ValidateDtoMiddleware} from '#src/rest/middleware/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '#src/rest/middleware/validate-objectid.middleware.js';
import {Component} from '#src/type/component.enum.js';
import {HttpMethod} from '#src/type/http-method.enum.js';
import {RequestBody} from '#src/type/request-body.type.js';
import {RequestParams} from '#src/type/request.params.type.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {fillDTO} from '#src/utils/dto.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {Ref} from '@typegoose/typegoose';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');
    this.addRoute({
      method: HttpMethod.Get,
      path: '/favorites',
      handler: this.getFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/premium',
      handler: this.getPremium
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/',
      handler: this.index
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/',
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDTO)
      ]
    });
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
      method: HttpMethod.Patch,
      path: '/:offerId',
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDTO),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      method: HttpMethod.Delete,
      path: '/:offerId',
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/:offerId/image',
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY_PATH'), 'image'),
      ]
    });
  }

  public async create(
    {body, tokenPayload}: Request<RequestParams, RequestBody, CreateOfferDTO>,
    res: Response
  ): Promise<void> {
    const userIdRef = tokenPayload.id as unknown as Ref<UserEntity>;

    const createdOffer = await this.offerService.create(userIdRef, body);
    this.created(res, fillDTO(OfferRDO, createdOffer));
  }

  public async index({query, tokenPayload}: Request, res: Response): Promise<void> {
    const cityId = typeof query.cityId === 'string' ? query.cityId : undefined;
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : undefined;
    const userIdRef = tokenPayload?.id as unknown as Ref<UserEntity>;

    if (limit && isNaN(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The \'limit\' parameter must be a valid number.',
        'OfferController'
      );
    }

    const foundOffers = await this.offerService.findShort(userIdRef, cityId, limit);
    this.ok(res, fillDTO(ShortOfferRDO, foundOffers));
  }

  public async getFavorites(
    {tokenPayload, query}: Request,
    res: Response
  ): Promise<void> {
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : undefined;
    const userIdRef = tokenPayload.id as unknown as Ref<UserEntity>;

    if (limit && isNaN(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The \'limit\' parameter must be a valid number.',
        'OfferController'
      );
    }

    const foundOffers = await this.offerService.findFavorites(userIdRef, limit);
    this.ok(res, fillDTO(ShortOfferRDO, foundOffers));
  }

  public async show({params, tokenPayload}: Request<ParamOfferId>, res: Response): Promise<void> {
    const offerIdRef = params.offerId as unknown as Ref<OfferEntity>;
    const userIdRef = tokenPayload?.id as unknown as Ref<UserEntity>;

    const foundOffer = await this.offerService.findFullById(offerIdRef, userIdRef);
    this.ok(res, fillDTO(OfferRDO, foundOffer));
  }

  public async update(
    {body, params, tokenPayload}: Request<ParamOfferId, RequestBody, UpdateOfferDTO>,
    res: Response
  ): Promise<void> {
    const offerIdRef = params.offerId as unknown as Ref<OfferEntity>;
    const userIdRef = tokenPayload.id as unknown as Ref<UserEntity>;

    const offer = await this.offerService.updateDetailById(offerIdRef, userIdRef, body);
    this.ok(res, fillDTO(PremiumOfferRDO, offer));
  }

  public async uploadImage(
    {params, file, tokenPayload}: Request<ParamOfferId>,
    res: Response
  ) {
    const offerIdRef = params.offerId as unknown as Ref<OfferEntity>;
    const userIdRef = tokenPayload.id as unknown as Ref<UserEntity>;
    const updateDto = {previewImage: file?.filename};
    this.logger.info(`Upload 'previewImage' file '${file?.filename}' for offer ID '${offerIdRef.toString()}'`);

    const offer = await this.offerService.updateImageById(offerIdRef, userIdRef, updateDto);
    this.created(res, fillDTO(UploadOfferImageRDO, offer));
  }

  public async delete(
    {params, tokenPayload}: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const offerIdRef = params.offerId as unknown as Ref<OfferEntity>;
    const userIdRef = tokenPayload.id as unknown as Ref<UserEntity>;

    const offer = await this.offerService.deleteById(offerIdRef, userIdRef);
    this.ok(res, fillDTO(PremiumOfferRDO, offer));
  }

  public async getPremium({query}: Request, res: Response): Promise<void> {
    const cityName = typeof query.cityName === 'string' ? query.cityName : undefined;
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : undefined;

    if (!cityName) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The \'cityName\' parameter must be a present.',
        'OfferController'
      );
    }

    if (limit && isNaN(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'The \'limit\' parameter must be a valid number.',
        'OfferController'
      );
    }

    const offers = await this.offerService.findPremiumByCity(cityName, limit);
    this.ok(res, fillDTO(PremiumOfferRDO, offers));
  }
}
