import { IsString, IsNotEmpty } from "class-validator";

export class ResetPasswordDTO {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
