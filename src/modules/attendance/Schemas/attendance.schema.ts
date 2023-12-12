import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Attendance {
  @Prop()
  studentId: string;

  @Prop()
  date: string;

  @Prop()
  isPresent: boolean;
}

export const attendanceSchema = SchemaFactory.createForClass(Attendance);
