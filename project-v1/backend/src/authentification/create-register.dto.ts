import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from "class-validator";

import { UserRole } from 'src/global/global.enum';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;


    @IsString()
    @IsNotEmpty()
    password: string;

    // OPTIONNAL
    @IsString()
    @IsOptional()
    biography: string;

    @IsEmail()
    @IsOptional()
    email: string;     


    @IsEnum(UserRole)
    @IsOptional()
    role: UserRole;

  }
  
  export default RegisterDto;