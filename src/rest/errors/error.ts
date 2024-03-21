import {ApplicationError} from '#src/rest/errors/type/application-error.enum.js';
import {ValidationErrorField} from '#src/rest/errors/type/validation-error-field.type.js';

export function createErrorObject(errorType: ApplicationError, error: string, details: ValidationErrorField[] = [], service?: string) {
  return {errorType, error, details, service};
}
