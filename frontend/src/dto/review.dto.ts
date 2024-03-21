import {UserDTO} from './user.dto';

export class ReviewDTO {
  public id!: string;
  public publishDate!: Date;
  public comment!: string;
  public rating!: number;
  public author!: UserDTO;
}
