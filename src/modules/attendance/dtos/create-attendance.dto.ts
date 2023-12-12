import { IsBoolean, IsDate, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAttendanceDto {
  @IsString()
  studentId: Types.ObjectId;

  @IsDate()
  date: string;

  @IsBoolean()
  isPresent: boolean;
}
