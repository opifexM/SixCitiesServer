import {UserType} from '#src/modules/user/type/user.type.js';
import {USER_VALIDATION_CONSTANT} from '#src/modules/user/validation/user-validation.constant.js';
import {IsEmail, IsEnum, IsString, Length} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @Length(USER_VALIDATION_CONSTANT.NAME.MIN_LENGTH, USER_VALIDATION_CONSTANT.NAME.MAX_LENGTH)
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsString()
  @Length(USER_VALIDATION_CONSTANT.PASSWORD.MIN_LENGTH, USER_VALIDATION_CONSTANT.PASSWORD.MAX_LENGTH)
  public password!: string;

  @IsEnum(UserType)
  public type!: UserType;
}
