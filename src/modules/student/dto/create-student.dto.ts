import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsNumber()
  mobileNumber: number;

  @IsString()
  password: string;

  @IsString()
  department: Types.ObjectId;

  @IsString()
  sem: number;

  @IsOptional()
  @IsString()
  authToken: string;
}
