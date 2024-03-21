import {REVIEW_VALIDATION_CONSTANT} from '#src/modules/review/validation/review-validation.constant.js';
import {IsNumber, IsString, Length, Max, Min} from 'class-validator';

export class CreateReviewDTO {
  @IsString()
  @Length(REVIEW_VALIDATION_CONSTANT.COMMENT.MIN_LENGTH, REVIEW_VALIDATION_CONSTANT.COMMENT.MAX_LENGTH)
  public comment!: string;

  @IsNumber()
  @Min(REVIEW_VALIDATION_CONSTANT.RATING.MIN)
  @Max(REVIEW_VALIDATION_CONSTANT.RATING.MAX)
  public rating!: number;
}
