import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSponsorDTO {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	logo: string;

	@IsOptional()
	website: string;

	@IsOptional()
	description: string;
}
