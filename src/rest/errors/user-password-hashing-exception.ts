import {BaseUserException} from '#src/rest/errors/base-user.exception.js';
import {StatusCodes} from 'http-status-codes';

export class UserPasswordHashingException extends BaseUserException {
  constructor(detail: string) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, 'Can not create hash password', detail);
  }
}
