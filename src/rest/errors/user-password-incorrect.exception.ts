import {BaseUserException} from '#src/rest/errors/base-user.exception.js';
import {StatusCodes} from 'http-status-codes';

export class UserPasswordIncorrectException extends BaseUserException {
  constructor(detail: string) {
    super(StatusCodes.UNAUTHORIZED, 'Incorrect user name or password', detail);
  }
}
