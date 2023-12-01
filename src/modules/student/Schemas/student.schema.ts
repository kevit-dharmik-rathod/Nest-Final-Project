import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Student {
    @Prop()
    name: string;

    @Prop({unique: true})
    email: string;

    @Prop({default:"STUDENT"})
    role: string;

    @Prop()
    password: string;

    @Prop()
    designation: string;

    @Prop()
    mobileNumber: number;

    @Prop()
    department: string;

    @Prop()
    authToken: string;
}
export const studentSchema = SchemaFactory.createForClass(Student);