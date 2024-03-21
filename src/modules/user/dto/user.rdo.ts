import {UserType} from '#src/modules/user/type/user.type.js';
import {Expose} from 'class-transformer';

export class UserRDO {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public type!: UserType;

  @Expose()
  public avatarUrl!: string;
}
