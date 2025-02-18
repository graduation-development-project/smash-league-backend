import { IsString, IsNotEmpty } from "class-validator";

export class VerifyOTPDTO {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    otp: string;
}
