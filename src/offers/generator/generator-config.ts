import {OFFER_VALIDATION_CONSTANT} from '#src/modules/offer/validation/offer-validation.constant.js';
import {REVIEW_VALIDATION_CONSTANT} from '#src/modules/review/validation/review-validation.constant.js';

export const GENERATOR_CONFIG = {
  MIN_RATING: REVIEW_VALIDATION_CONSTANT.RATING.MIN,
  MAX_RATING: REVIEW_VALIDATION_CONSTANT.RATING.MAX,
  MIN_BEDROOM: OFFER_VALIDATION_CONSTANT.BEDROOM.MIN,
  MAX_BEDROOM: OFFER_VALIDATION_CONSTANT.BEDROOM.MAX,
  MIN_ROOM: OFFER_VALIDATION_CONSTANT.ROOM.MIN,
  MAX_ROOM: OFFER_VALIDATION_CONSTANT.ROOM.MAX,
  MIN_PRICE: OFFER_VALIDATION_CONSTANT.PRICE.MIN,
  MAX_PRICE: OFFER_VALIDATION_CONSTANT.PRICE.MAX,
  MIN_VISITOR: OFFER_VALIDATION_CONSTANT.VISITOR.MIN,
  MAX_VISITOR: OFFER_VALIDATION_CONSTANT.VISITOR.MAX,
  FIRST_WEEK_DAY: 1,
  LAST_WEEK_DAY: 7,
};