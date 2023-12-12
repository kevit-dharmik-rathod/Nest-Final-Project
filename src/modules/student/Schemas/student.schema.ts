import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Student {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ default: 'STUDENT' })
  role: string;

  @Prop()
  mobileNumber: number;

  @Prop()
  password: string;

  @Prop({ type: Types.ObjectId })
  department: Types.ObjectId;

  @Prop()
  sem: string;

  @Prop()
  authToken: string;
}
export const studentSchema = SchemaFactory.createForClass(Student);
