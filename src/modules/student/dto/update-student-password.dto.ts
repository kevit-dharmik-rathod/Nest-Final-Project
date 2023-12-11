import { IsString } from "class-validator";

export class UpdateStudentPasswordDto {
    @IsString()
    password: string;
}
