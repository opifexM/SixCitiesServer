import {CreateUserDTO} from '#src/modules/user/dto/create-user.dto.js';

export class UserDTO extends CreateUserDTO {
  public avatarUrl!: string;
}
