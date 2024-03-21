import {CreateOfferDTO} from '#src/modules/offer/dto/create-offer.dto.js';

export class OfferDTO extends CreateOfferDTO {
  public publishDate!: Date;
  public previewImage!: string;
  public images!: string[];
}
