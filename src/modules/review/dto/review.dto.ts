import {CreateReviewDTO} from '#src/modules/review/dto/create-review.dto.js';

export class ReviewDTO extends CreateReviewDTO {
  public publishDate!: Date;
}
