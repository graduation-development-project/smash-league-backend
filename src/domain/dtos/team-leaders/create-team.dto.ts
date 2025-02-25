import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTeamDTO {
	@IsString()
	@IsNotEmpty()
	teamLeaderId: string;

	@IsString()
	@IsNotEmpty()
	teamName: string;

	@IsNotEmpty()
	logo: Express.Multer.File[];

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	description: string;
}
