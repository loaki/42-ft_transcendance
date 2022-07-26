import { IsNotEmpty, IsString } from "class-validator"

export class TwoFaAuthDto {
    @IsString()
    @IsNotEmpty()
    code: string
}