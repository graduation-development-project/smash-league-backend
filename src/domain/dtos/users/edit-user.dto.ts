import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "./create-user.dto";
import { IsOptional, IsString } from "class-validator";

export class EditUserDTO extends PartialType(CreateUserDTO) {
	@IsOptional()
	@IsString()
	location: string;

	@IsOptional()
	@IsString()
	placeOfBirth: string;

	@IsOptional()
	startPlayingCompetitively: Date;

	@IsOptional()
	startPlayingSport: Date;

	@IsOptional()
	@IsString()
	sportAmbitions: string;
}
