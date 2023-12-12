import { IsNumber, IsString } from 'class-validator';

export class LoginStudentDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
