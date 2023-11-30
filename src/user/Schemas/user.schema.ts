import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop({unique: true})
    email: string;

    @Prop()
    password: string;

    @Prop()
    designation: string;

    @Prop()
    mobileNumber: number;

    @Prop()
    department: string;

    @Prop()
    role: string;

    @Prop()
    authToken: string;
}
export const userSchema = SchemaFactory.createForClass(User);