import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from "class-validator";

import { UserRole } from 'src/global/global.enum';

// Minimum for creating a user
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;
    // id: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    password: string;


    // OPTIONNAl
    @IsString()
    @IsOptional()
    biography: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsEnum(UserRole)
    @IsOptional()
    role: UserRole;

    // Adding password
}
