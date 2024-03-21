#!/usr/bin/env node
import 'reflect-metadata';
import {createAuthContainer} from '#src/modules/auth/auth.container.js';
import {createCityContainer} from '#src/modules/city/city.container.js';
import {createOfferContainer} from '#src/modules/offer/offer.container.js';
import {createReviewContainer} from '#src/modules/review/review.container.js';
import {createUserContainer} from '#src/modules/user/user.container.js';
import {RestApplication} from '#src/rest/rest.application.js';
import {createRestApplicationContainer} from '#src/rest/rest.container.js';
import {Component} from '#src/type/component.enum.js';
import {Container} from 'inversify';


async function bootstrap() {
  const restApplicationContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createCityContainer(),
    createOfferContainer(),
    createReviewContainer(),
    createAuthContainer()
  );
  const restApplication = restApplicationContainer.get<RestApplication>(Component.RestApplication);
  await restApplication.init();
}

bootstrap();
