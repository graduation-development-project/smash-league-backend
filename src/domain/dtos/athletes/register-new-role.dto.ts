import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterNewRoleDTO {
	@IsNotEmpty()
	@IsString()
	userId: string;

	@IsNotEmpty()
	@IsString()
	role: string;

	@IsNotEmpty()
	files: Express.Multer.File[];
}
