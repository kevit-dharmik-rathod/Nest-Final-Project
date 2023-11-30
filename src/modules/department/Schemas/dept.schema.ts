import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Department {
    @Prop()
    name: string;

    @Prop()
    initial: string;

    @Prop()
    password: string;

    @Prop()
    availableSeats: number;

    @Prop()
    occupiedSeats: number;
    
    @Prop()
    batch: number;   
}
export const departmentSchema = SchemaFactory.createForClass(Department);