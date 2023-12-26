import { IsString, IsNumber } from 'class-validator';
export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  designation: string;

  @IsNumber()
  mobileNumber: number;

  @IsString()
  department: string;

  @IsString()
  role: string;
}
