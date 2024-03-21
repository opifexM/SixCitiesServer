import {UserTypeDTO} from './user-type.dto';

export class UserDTO {
  public name!: string;
  public email!: string;
  public type!: UserTypeDTO;
  public avatarUrl!: string;
}
