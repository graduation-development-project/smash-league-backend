import { IsString, IsNotEmpty } from "class-validator";

export class SignInDTO {
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
