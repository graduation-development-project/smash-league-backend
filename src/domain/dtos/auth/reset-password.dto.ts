import {IsString, IsNotEmpty, IsEmail} from "class-validator";

export class ResetPasswordDTO {
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;


    @IsString()
    @IsNotEmpty()
    otp: string;
}
