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

export class RegisterNewRoleWithDegreeDTO {
	@IsOptional()
	@IsString()
	userId: string;

	@IsNotEmpty()
	@IsString()
	role: string;

	@IsOptional()
	@IsString()
	IDCardFront: string;

	@IsOptional()
	@IsString()
	IDCardBack: string;

	@IsOptional()
	@IsString()
	cardPhoto: string;

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
