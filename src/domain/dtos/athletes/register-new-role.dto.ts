import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterNewRoleDTO {
	@IsNotEmpty()
	@IsString()
	role: string;

	@IsNotEmpty()
	@IsString()
	IDCardFront: string;

	@IsNotEmpty()
	@IsString()
	IDCardBack: string;

	@IsNotEmpty()
	@IsString()
	cardPhoto: string;
}
