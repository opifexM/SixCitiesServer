import {AuthService} from '#src/modules/auth/auth-service.interface.js';
import {DefaultAuthService} from '#src/modules/auth/default-auth.service.js';
import {AuthExceptionFilter} from '#src/rest/exception-filter/auth.exception-filter.js';
import {ExceptionFilter} from '#src/rest/exception-filter/exception-filter.interface.js';
import {Component} from '#src/type/component.enum.js';
import {Container} from 'inversify';

export function createAuthContainer(): Container {
  const authContainer = new Container;
  authContainer.bind<AuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
  authContainer.bind<ExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

  return authContainer;
}
