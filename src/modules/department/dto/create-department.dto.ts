import { IsString, IsNumber } from "class-validator";
export class CreateDepartmentDto {
    @IsString()
    name: string;

    @IsString()
    initial: string;

    @IsNumber()
    availableSeats: number;

    @IsNumber()
    occupiedSeats: number;
    
    @IsNumber()
    batch: number;
}
