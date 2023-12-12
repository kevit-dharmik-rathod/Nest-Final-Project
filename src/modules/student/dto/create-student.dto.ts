import { IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  role: string;

  @IsNumber()
  mobileNumber: number;

  @IsString()
  password: string;

  @IsString()
  department: Types.ObjectId;

  @IsString()
  sem: string;

  @IsString()
  authToken: string;
}
