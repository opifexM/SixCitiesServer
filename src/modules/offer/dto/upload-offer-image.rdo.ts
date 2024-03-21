import {Expose} from 'class-transformer';

export class UploadOfferImageRDO {
  @Expose()
  public previewImage!: string;
}
