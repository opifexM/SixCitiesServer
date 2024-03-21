import {Expose} from 'class-transformer';

export class UploadUserAvatarRDO {
  @Expose()
  public avatarUrl!: string;
}
