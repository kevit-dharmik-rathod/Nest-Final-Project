import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Student {
    @Prop()
    name: string;

    @Prop({ unique: true })
    email: string;

    @Prop({ default: "STUDENT" })
    role: string;

    @Prop()
    mobileNumber: number;

    @Prop()
    password: string;

    @Prop()
    department: string;

    @Prop()
    sem: string;

    @Prop()
    authToken: string;
}
export const studentSchema = SchemaFactory.createForClass(Student);