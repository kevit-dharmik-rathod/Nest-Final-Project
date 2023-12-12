import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Attendance {
  @Prop()
  studentId: Types.ObjectId;

  @Prop()
  date: string;

  @Prop()
  isPresent: boolean;
}

export const attendanceSchema = SchemaFactory.createForClass(Attendance);
