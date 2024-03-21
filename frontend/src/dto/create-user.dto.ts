import {UserType} from '../const';
import {UserTypeDTO} from './user-type.dto';

export class CreateUserDTO {
  public name!: string;
  public email!: string;
  public password!: string;
  public type!: UserTypeDTO;
}

export type UserRegister = {
  name: string,
  email: string,
  password: string,
  type: UserType,
}
