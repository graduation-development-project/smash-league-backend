import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from "class-validator";
import { TypeOfUmpireDegree } from "@prisma/client";

export class RegisterNewRoleDTO {
	@IsOptional()
	@IsString()
	userId: string;

	@IsNotEmpty()
	@IsString()
	role: string;

	@IsOptional()
	files: Express.Multer.File[];

	@IsOptional()
	registerUmpire: RegisterUmpireDegree[];
}

export class RegisterUmpireDegree {
	@IsOptional()
	@IsEnum(TypeOfUmpireDegree)
	typeOfDegree: TypeOfUmpireDegree;

	@IsOptional()
	@IsString()
	degreeTitle: string;

	@IsOptional()
	degree: string[];

	@IsOptional()
	@IsString()
	description: string;
}
