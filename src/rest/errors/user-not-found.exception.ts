import {BaseUserException} from '#src/rest/errors/base-user.exception.js';
import {StatusCodes} from 'http-status-codes';

export class UserNotFoundException extends BaseUserException {
  constructor(detail: string) {
    super(StatusCodes.NOT_FOUND, 'User not found', detail);
  }
}
