import {MongoReviewRepository} from '#src/modules/review/repository/mongo-review.repository.js';
import {ReviewRepository} from '#src/modules/review/repository/review-repository.interface.js';
import {ReviewController} from '#src/modules/review/review.controller.js';
import {ReviewEntity, ReviewModel} from '#src/modules/review/review.entity.js';
import {DefaultReviewService} from '#src/modules/review/service/default-review.service.js';
import {ReviewService} from '#src/modules/review/service/review-service.interface.js';
import {Controller} from '#src/rest/controller/controller.interface.js';
import {Component} from '#src/type/component.enum.js';
import {types} from '@typegoose/typegoose';
import {Container} from 'inversify';

export function createReviewContainer(): Container {
  const reviewContainer = new Container();
  reviewContainer.bind<types.ModelType<ReviewEntity>>(Component.ReviewModel).toConstantValue(ReviewModel);
  reviewContainer.bind<ReviewService>(Component.ReviewService).to(DefaultReviewService).inSingletonScope();
  reviewContainer.bind<ReviewRepository>(Component.ReviewRepository).to(MongoReviewRepository).inSingletonScope();
  reviewContainer.bind<Controller>(Component.ReviewController).to(ReviewController).inSingletonScope();

  return reviewContainer;
}
