import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {OfferService} from '#src/modules/offer/service/offer-service.interface.js';
import {ParamOfferId} from '#src/modules/offer/type/param-offerid.type.js';
import {CreateUserDTO} from '#src/modules/user/dto/create-user.dto.js';
import {LoggedUserRDO} from '#src/modules/user/dto/logged-user.rdo.js';
import {LoginUserDTO} from '#src/modules/user/dto/login-user.dto.js';
import {UploadUserAvatarRDO} from '#src/modules/user/dto/upload-user-avatar.rdo.js';
import {UserRDO} from '#src/modules/user/dto/user.rdo.js';
import {UserService} from '#src/modules/user/service/user-service.interface.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {BaseController} from '#src/rest/controller/base-controller.abstract.js';
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
import {inject, injectable} from 'inversify';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController...');
    this.addRoute({
      method: HttpMethod.Post,
      path: '/',
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDTO)]
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/login',
      handler: this.checkAuthenticate
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/login',
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDTO)]
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/avatar',
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY_PATH'), 'avatar')
      ]
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/favorites/:offerId',
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      method: HttpMethod.Delete,
      path: '/favorites/:offerId',
      handler: this.deleteFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async create({body}: Request<RequestParams, RequestBody, CreateUserDTO>, res: Response): Promise<void> {
    const createdUser = await this.userService.create(body);
    this.created(res, fillDTO(UserRDO, createdUser));
  }

  public async uploadAvatar({tokenPayload, file}: Request, res: Response): Promise<void> {
    const userIdRef = tokenPayload.id as unknown as Ref<UserEntity>;
    const updateDto = {avatarUrl: file?.filename};
    this.logger.info(`Upload 'avatarUrl' file '${file?.filename}' for user ID '${userIdRef.toString()}'`);

    const user = await this.userService.updateById(userIdRef, updateDto);
    this.created(res, fillDTO(UploadUserAvatarRDO, user));
  }

  public async addFavorite(
    {params, tokenPayload}: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const userIdRef = tokenPayload.id as unknown as Ref<UserEntity>;
    const offerIdRef = params.offerId as unknown as Ref<OfferEntity>;

    await this.userService.addOfferToFavorites(userIdRef, offerIdRef);
    this.created(res, {});
  }

  public async deleteFavorite(
    {params, tokenPayload}: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const userIdRef = tokenPayload.id as unknown as Ref<UserEntity>;
    const offerIdRef = params.offerId as unknown as Ref<OfferEntity>;

    await this.userService.removeOfferFromFavorites(userIdRef, offerIdRef);
    this.noContent(res, {});
  }

  private async login({body}: Request<RequestParams, RequestBody, LoginUserDTO>, res: Response): Promise<void> {
    const authenticatedUserToken = await this.userService.login(body.email, body.password);
    const responseData = fillDTO(LoggedUserRDO, {
      email: body.email,
      token: authenticatedUserToken,
    });
    this.ok(res, responseData);
  }

  private async checkAuthenticate({tokenPayload}: Request, res: Response): Promise<void> {
    await this.userService.checkAuthenticate(tokenPayload?.email);
    this.ok(res, {email: tokenPayload?.email});
  }
}
