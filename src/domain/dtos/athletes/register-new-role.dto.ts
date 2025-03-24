import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterNewRoleDTO {
	@IsOptional()
	@IsString()
	userId: string;

	@IsNotEmpty()
	@IsString()
	role: string;

	@IsOptional()
	files: Express.Multer.File[];
}
