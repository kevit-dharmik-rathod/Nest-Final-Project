import { IsBoolean, IsDate, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  studentId: string;

  @IsDate()
  date: string;

  @IsBoolean()
  isPresent: boolean;
}
