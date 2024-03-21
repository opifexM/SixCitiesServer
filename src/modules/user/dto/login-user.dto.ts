import {USER_VALIDATION_CONSTANT} from '#src/modules/user/validation/user-validation.constant.js';
import {IsEmail, IsString, Length} from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  public email!: string;

  @IsString()
  @Length(USER_VALIDATION_CONSTANT.PASSWORD.MIN_LENGTH, USER_VALIDATION_CONSTANT.PASSWORD.MAX_LENGTH)
  public password!: string;
}
