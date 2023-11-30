
import { IsString, IsNumber, IsOptional } from "class-validator";
export class UpdateUserAdminDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsString()
    @IsOptional()
    designation: string;

    @IsNumber()
    @IsOptional()
    mobileNumber: number;

    @IsString()
    @IsOptional()
    department: string;

    @IsString()
    @IsOptional()
    role: string;
}
