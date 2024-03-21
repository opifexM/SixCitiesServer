import {HttpError} from '#src/rest/errors/http-error.js';
import {ValidationErrorField} from '#src/rest/errors/type/validation-error-field.type.js';
import {ValidationError} from 'class-validator';
import {StatusCodes} from 'http-status-codes';

export function validateAndResolveLimit(maxLimit: number, serviceName: string, requestedLimit?: number): number {
  if (requestedLimit && requestedLimit > maxLimit) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `The 'limit' parameter cannot exceed ${maxLimit}.`,
      serviceName
    );
  }

  return Math.min(requestedLimit ?? Number.MAX_VALUE, maxLimit);
}

export function reduceValidationErrors(errors: ValidationError[]): ValidationErrorField[] {
  return errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));
}
