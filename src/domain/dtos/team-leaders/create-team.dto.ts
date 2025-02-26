import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateTeamDTO {
	@IsString()
	@IsNotEmpty()
	teamLeaderId: string;

	@IsString()
	@IsNotEmpty()
	teamName: string;

	@IsNotEmpty()
	@IsArray()
	logo: Express.Multer.File[];

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	description: string;
}
