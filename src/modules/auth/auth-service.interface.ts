import {UserEntity} from '#src/modules/user/user.entity.js';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;

  verify(inputPassword: string, existingUser: UserEntity): Promise<UserEntity>;

  encryptInputPassword(inputPassword: string): Promise<string>;
}
