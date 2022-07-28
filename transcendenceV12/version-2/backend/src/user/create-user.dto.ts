import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from "class-validator";

import { UserRole } from 'src/global/global.enum';

// Minimum for creating a user
export class CreateUse42rDto {
    @IsString()
    @IsNotEmpty()
    username: string;
    // id: string;

    @IsString()
    @IsNotEmpty()
    avatar: string;

    @IsString()
    @IsNotEmpty()
    studentID: string;


    // // OPTIONNAl
    // @IsString()
    // @IsOptional()
    // biography: string;

    // @IsEmail()
    // @IsOptional()
    // email: string;

    // @IsEnum(UserRole)
    // @IsOptional()
    // role: UserRole;

    // Adding password
}




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

export class PseudoDTO {
    @IsString()
    @IsNotEmpty()
    pseudo: string;
}


export class BioDTO {
    @IsString()
    @IsNotEmpty()
    biography: string;
}

export class EmailDTO {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
}