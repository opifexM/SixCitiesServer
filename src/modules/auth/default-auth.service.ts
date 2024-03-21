import {AuthService} from '#src/modules/auth/auth-service.interface.js';
import {TokenPayload} from '#src/modules/auth/type/token-payload.js';
import {UserEntity} from '#src/modules/user/user.entity.js';
import {UserPasswordHashingException} from '#src/rest/errors/user-password-hashing-exception.js';
import {UserPasswordIncorrectException} from '#src/rest/errors/user-password-incorrect.exception.js';
import {Component} from '#src/type/component.enum.js';
import {Config} from '#src/utils/config/config.interface.js';
import {RestSchema} from '#src/utils/config/rest.schema.js';
import {CryptoProtocol} from '#src/utils/crypto/crypto.interface.js';
import {Logger} from '#src/utils/logger/logger.interface.js';
import {inject, injectable} from 'inversify';
import {SignJWT} from 'jose';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.Crypto) private readonly cryptoProtocol: CryptoProtocol,
  ) {
  }

  public async authenticate(user: UserEntity): Promise<string> {
    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({alg: this.config.get('JWT_ALGORITHM')})
      .setIssuedAt()
      .setExpirationTime(this.config.get('JWT_EXPIRED'))
      .sign(Buffer.from(this.config.get('JWT_SECRET')));
  }

  public async verify(inputPassword: string, existingUser: UserEntity): Promise<UserEntity> {
    const isPasswordValid = await this.cryptoProtocol.verifyPassword(existingUser.password, inputPassword);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for user ${existingUser.email}`);
      throw new UserPasswordIncorrectException('AuthService');
    }
    return existingUser;
  }

  public async encryptInputPassword(inputPassword: string): Promise<string> {
    const hashedPassword = await this.cryptoProtocol.hashPassword(inputPassword);
    if (!hashedPassword) {
      this.logger.warn('Can not create hash password for user');
      throw new UserPasswordHashingException('AuthService');
    }
    return hashedPassword;
  }
}
