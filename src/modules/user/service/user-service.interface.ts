import {OfferEntity} from '#src/modules/offer/offer.entity.js';
import {User} from '#src/modules/user/type/user.type.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {DocumentExists} from '#src/rest/middleware/document-exists.interface.js';
import {Ref} from '@typegoose/typegoose';

export interface UserService extends DocumentExists {
  findOrCreate(userData: User): Promise<UserEntity>;

  create(CreateUserDto: User): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserEntity | null>;

  findById(userIdRef: Ref<UserEntity>): Promise<UserEntity | null>;

  updateById(userIdRef: Ref<UserEntity>, userData: Partial<User>): Promise<User>;

  getIdRefByEmail(userEmail: string): Promise<Ref<UserEntity> | null>;

  getFavoriteOffers(userIdRef: Ref<UserEntity>): Promise<Ref<OfferEntity>[]>;

  addOfferToFavorites(userIdRef: Ref<UserEntity>, offerIdRef: Ref<OfferEntity>): Promise<boolean>;

  removeOfferFromFavorites(userIdRef: Ref<UserEntity>, offerIdRef: Ref<OfferEntity>): Promise<boolean>;

  exists(userId: string): Promise<boolean>;

  login(inputLogin: string, inputPassword: string): Promise<string>;

  checkAuthenticate(email?: string): Promise<boolean>;

  logout(): Promise<boolean>;
}
