import { IsString } from 'class-validator';
export class UpdateOtherUserDto {
  @IsString()
  password: string;
}
