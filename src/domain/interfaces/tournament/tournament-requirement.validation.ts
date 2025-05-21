import { RequirementType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateRequirement {
	@IsString()
	@IsNotEmpty()
	requirementName: string;
	@IsString()
	@IsNotEmpty()
	requirementDescription: string;
	@IsNotEmpty()
	@IsEnum(RequirementType, {
		message: "Requirement type must be one of the following: Selection, FillIn"})
	requirementType: RequirementType;
}

export class CreateRequirements {
	createRequirements: CreateRequirement[];
}