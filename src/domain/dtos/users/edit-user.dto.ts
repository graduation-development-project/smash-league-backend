import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "./create-user.dto";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { UserEntity } from "../../entities/authentication/user.entity";
import { Hands } from "@prisma/client";

export class EditUserDTO extends PartialType(UserEntity) {
	@IsOptional()
	@IsString()
	location: string;

	@IsOptional()
	@IsEnum(Hands)
	hand: Hands;

	@IsOptional()
	@IsNumber()
	height: number;

	@IsOptional()
	@IsString()
	description: string;

	@IsOptional()
	@IsString()
	placeOfBirth: string;

	@IsOptional()
	startPlayingCompetitively: string;

	@IsOptional()
	startPlayingSport: string;

	@IsOptional()
	@IsString()
	sportAmbitions: string;
}
