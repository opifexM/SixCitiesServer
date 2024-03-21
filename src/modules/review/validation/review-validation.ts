import {OfferValidation} from '#src/modules/offer/validation/offer-validation.js';
import {REVIEW_VALIDATION_CONSTANT} from '#src/modules/review/validation/review-validation.constant.js';
import {UserValidation} from '#src/modules/user/validation/user-validation.js';
import {Type} from 'class-transformer';
import {IsNumber, IsString, Length, Max, Min, ValidateNested} from 'class-validator';

export class ReviewValidation {
  @ValidateNested()
  @Type(() => UserValidation)
  public author!: UserValidation;

  @IsString()
  @Length(REVIEW_VALIDATION_CONSTANT.COMMENT.MIN_LENGTH, REVIEW_VALIDATION_CONSTANT.COMMENT.MAX_LENGTH)
  public comment!: string;

  @ValidateNested()
  @Type(() => OfferValidation)
  public offer!: OfferValidation;

  @IsNumber()
  @Min(REVIEW_VALIDATION_CONSTANT.RATING.MIN)
  @Max(REVIEW_VALIDATION_CONSTANT.RATING.MAX)
  public rating!: number;
}
