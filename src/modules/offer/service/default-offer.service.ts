import {CityEntity} from '#src/modules/city/city.entity.js';
import {CityService} from '#src/modules/city/service/city-service.interface.js';
import {CreateOfferDTO} from '#src/modules/offer/dto/create-offer.dto.js';
import {OfferDTO} from '#src/modules/offer/dto/offer.dto.js';
import {UpdateOfferDTO} from '#src/modules/offer/dto/update-offer.dto.js';
import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {OfferRepository} from '#src/modules/offer/repository/offer-repository.interface.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {Offer} from '#src/modules/offer/type/offer.type.js';
import {OFFER_VALIDATION_CONSTANT} from '#src/modules/offer/validation/offer-validation.constant.js';
import {UserService} from '#src/modules/user/service/user-service.interface.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {ENTITY_PROFILE_CONFIG, LIST_LIMITS_CONFIG} from '#src/rest/config.constant.js';
import {HttpError} from '#src/rest/errors/http-error.js';
import {Component} from '#src/type/component.enum.js';
import {MongooseObjectId} from '#src/type/mongoose-objectid.type.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {validateAndResolveLimit} from '#src/utils/validator.js';
import {Ref} from '@typegoose/typegoose';
import {StatusCodes} from 'http-status-codes';
import {inject, injectable} from 'inversify';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferRepository) private readonly offerRepository: OfferRepository,
    @inject(Component.CityService) private readonly cityService: CityService,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
  }

  public async findShort(
    userIdRef?: Ref<UserEntity>,
    cityId?: string,
    requestedLimit: number = LIST_LIMITS_CONFIG.OFFERS_LIST_LIMIT_DEFAULT
  ): Promise<OfferEntity[]> {
    const limit = validateAndResolveLimit(LIST_LIMITS_CONFIG.OFFERS_LIST_LIMIT, 'OfferService', requestedLimit);

    if (cityId && !await this.cityService.exists(cityId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `City with ID '${cityId}' not found.`,
        'OfferService'
      );
    }

    let favoriteOfferIds: Ref<OfferEntity>[] = [];
    if (userIdRef) {
      favoriteOfferIds = await this.userService.getFavoriteOffers(userIdRef);
    }

    return this.offerRepository.findAllWithFavorite(limit, favoriteOfferIds, cityId);
  }

  public async findFullById(offerIdRef: Ref<OfferEntity>, userIdRef?: Ref<UserEntity>): Promise<OfferEntity | null> {
    let favoriteOfferIds: Ref<OfferEntity>[] = [];
    if (userIdRef) {
      favoriteOfferIds = await this.userService.getFavoriteOffers(userIdRef);
    }

    return this.offerRepository.findByIdWithFavorite(offerIdRef, favoriteOfferIds);
  }

  public async create(hostIdRef: Ref<UserEntity>, offerParams: CreateOfferDTO): Promise<Offer> {
    const offerTitleTrimmed = offerParams.title.trim();
    const existedOffer = await this.offerRepository.findByTitle(offerTitleTrimmed);
    if (existedOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Offer with title '${offerTitleTrimmed}' exists.`,
        'OfferService'
      );
    }

    const cityIdRef = await this.cityService.getIdRefByName(offerParams.city.name);
    if (!cityIdRef) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `City '${offerParams.city.name}' not found`,
        'OfferService'
      );
    }

    const offerData: OfferDTO = {
      ...offerParams,
      publishDate: new Date(),
      previewImage: ENTITY_PROFILE_CONFIG.DEFAULT_OFFER_PREVIEW_URL,
      images: new Array(OFFER_VALIDATION_CONSTANT.IMAGES.MIN_COUNT).fill(ENTITY_PROFILE_CONFIG.DEFAULT_OFFER_GALLERY_URL)
    };

    return this.createOfferInternal(hostIdRef, cityIdRef, offerData);
  }

  public async findPremiumByCity(cityName: string, requestedLimit?: number): Promise<OfferEntity[]> {
    const limit = validateAndResolveLimit(LIST_LIMITS_CONFIG.PREMIUM_LIST_LIMIT, 'OfferService', requestedLimit);
    const foundCity = await this.cityService.findByName(cityName);

    if (!foundCity) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `City with name '${cityName}' not found.`,
        'OfferService'
      );
    }

    const premiumCityOffers = await this.offerRepository.findPremiumByCity(foundCity.id, limit);

    this.logger.info(`Completed search for premium offers in city '${foundCity.name}'. Found ${premiumCityOffers.length} offers.`);
    return premiumCityOffers;
  }

  public async incrementReviewCount(offerIdRef: Ref<OfferEntity>): Promise<boolean> {
    this.logger.info(`Attempting to increment review count for offer with ID: '${offerIdRef.toString()}'`);
    return this.offerRepository.incrementReviewCount(offerIdRef);
  }

  public async exists(offerId: string): Promise<boolean> {
    if (!MongooseObjectId.isValid(offerId)) {
      return false;
    }

    const objectId = new MongooseObjectId(offerId);
    return this.offerRepository.exists(objectId);
  }

  public async findById(offerIdRef: Ref<OfferEntity>): Promise<OfferEntity | null> {
    return this.offerRepository.findById(offerIdRef);
  }

  public async updateDetailById(offerIdRef: Ref<OfferEntity>, hostIdRef: Ref<UserEntity>, offerData: Partial<Offer>): Promise<Offer> {
    const allowedFields: (keyof Offer)[] = ['title', 'description', 'isPremium', 'type', 'room', 'bedroom', 'price', 'goods', 'visitor'];
    return this.updateById(offerIdRef, hostIdRef, offerData, allowedFields);
  }

  public async updateImageById(offerIdRef: Ref<OfferEntity>, hostIdRef: Ref<UserEntity>, offerData: Partial<Offer>): Promise<Offer> {
    const allowedFields: (keyof Offer)[] = ['images', 'previewImage'];
    return await this.updateById(offerIdRef, hostIdRef, offerData, allowedFields);
  }

  public async deleteById(offerIdRef: Ref<OfferEntity>, hostIdRef: Ref<UserEntity>): Promise<Offer> {
    const deletedOffer = await this.offerRepository.deleteById(offerIdRef);
    if (!deletedOffer) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Offer with ID '${offerIdRef.toString()}' can't be delete`,
        'OfferService'
      );
    }

    if (hostIdRef.toString() !== deletedOffer.hostId.id) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `Offer with ID '${offerIdRef.toString()}' can't be delete with user ID ${hostIdRef.toString()}.`,
        'OfferService'
      );
    }

    this.logger.info(`Offer with ID '${offerIdRef.toString()}' deleted`);
    return deletedOffer.populate(['cityId', 'hostId']);
  }

  public async findFavorites(userIdRef: Ref<UserEntity>, requestedLimit?: number): Promise<OfferEntity[]> {
    const limit = validateAndResolveLimit(LIST_LIMITS_CONFIG.FAVORITE_LIST_LIMIT, 'OfferService', requestedLimit);

    let favoriteOfferIds: Ref<OfferEntity>[] = [];
    if (userIdRef) {
      favoriteOfferIds = await this.userService.getFavoriteOffers(userIdRef);
    }

    return this.offerRepository.findFavorite(limit, favoriteOfferIds);
  }

  public async findOrCreate(offerData: Offer): Promise<Offer> {
    const offerTitleTrimmed = offerData.title.trim();
    const existedOffer = await this.offerRepository.findByTitle(offerTitleTrimmed);
    if (existedOffer) {
      return existedOffer.populate(['cityId', 'hostId']);
    }

    const cityIdRef = await this.cityService.getIdRefByName(offerData.city.name);
    const hostIdRef = await this.userService.getIdRefByEmail(offerData.host.email);
    if (!cityIdRef || !hostIdRef) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error creating offer '${offerData.title}'. An unknown error occurred.'}`,
        'OfferService'
      );
    }

    return this.createOfferInternal(hostIdRef, cityIdRef, offerData);
  }

  public async setRating(offerIdRef: Ref<OfferEntity>, averageRating: number): Promise<boolean> {
    const roundedRating = Number(averageRating.toFixed(2));
    this.logger.info(`Setting average rating for offer with ID: '${offerIdRef.toString()}' to ${roundedRating}`);
    return this.offerRepository.updateRating(offerIdRef, roundedRating);
  }

  public async findByIdList(offerIds: Ref<OfferEntity>[], limit: number): Promise<OfferEntity[]> {
    return this.offerRepository.findByIds(offerIds, limit);
  }

  public async getIdRefByTitle(offerTitle: string): Promise<Ref<OfferEntity> | null> {
    const offerTitleTrimmed = offerTitle.trim();
    const foundOffer = await this.offerRepository.findByTitle(offerTitleTrimmed);

    return foundOffer?.id ?? null;
  }

  private async updateById(offerIdRef: Ref<OfferEntity>,
    hostIdRef: Ref<UserEntity>,
    offerData: Partial<Offer>,
    allowedFieldsToUpdate: (keyof Offer)[]
  ): Promise<Offer> {
    const existedOffer = await this.findById(offerIdRef);
    if (!existedOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Offer with ID '${offerIdRef}' not found.`,
        'OfferService'
      );
    }
    if (hostIdRef.toString() !== existedOffer.hostId.id.toString()) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `Offer with ID '${offerIdRef.toString()}' can't be update with user ID '${hostIdRef.toString()}'.`,
        'OfferService'
      );
    }

    const filteredData = allowedFieldsToUpdate.reduce((acc, key) => {
      const value = offerData[key];
      if (value !== undefined) {
        // @ts-expect-error acc[key]
        acc[key] = value;
      }
      return acc;
    }, {} as UpdateOfferDTO);

    const updatedOffer = await this.offerRepository.updateById(offerIdRef, filteredData);
    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Offer with ID '${offerIdRef.toString()}' can't be update`,
        'OfferService'
      );
    }

    this.logger.info(`Offer with ID '${offerIdRef.toString()}' updated`);
    return updatedOffer.populate(['cityId', 'hostId']);
  }

  private async createOfferInternal(hostIdRef: Ref<UserEntity>, cityIdRef: Ref<CityEntity>, offerData: OfferDTO): Promise<Offer> {
    try {
      const createdOffer = new OfferEntity(offerData, cityIdRef, hostIdRef);
      const result = await this.offerRepository.create(createdOffer);

      this.logger.info(`New [offer] created: ${createdOffer.title}`);
      return result.populate(['cityId', 'hostId']);

    } catch (error) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Error creating offer '${offerData.title}'. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`,
        'OfferService'
      );
    }
  }
}
