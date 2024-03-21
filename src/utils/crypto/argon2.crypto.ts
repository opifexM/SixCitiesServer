import {CryptoProtocol} from '#src/utils/crypto/crypto.interface.js';
import argon2 from 'argon2';
import {injectable} from 'inversify';

@injectable()
export class Argon2Crypto implements CryptoProtocol {
  public async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to hash the password: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while hashing the password.');
      }
    }
  }

  public async verifyPassword(storedHash: string, inputPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(storedHash, inputPassword);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to verify the password: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while verifying the password.');
      }
    }
  }
}
