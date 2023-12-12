import { IsOptional, IsString } from 'class-validator';

export class UpdateStudentOtherFields {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  mobileNumber: number;

  @IsOptional()
  @IsString()
  department: string;

  @IsOptional()
  @IsString()
  sem: number;
}
