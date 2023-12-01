import { IsNumber, IsString } from "class-validator";

export class CreateStudentDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    role: string;

    @IsNumber()
    mobileNumber: number;

    @IsString()
    password: string;

    @IsString()
    department: string;

    @IsString()
    sem: string;

    @IsString()
    authToken: string;
}

