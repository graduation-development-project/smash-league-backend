import { IsNotEmpty, IsString } from "class-validator";

export class CreateRequirement {
	@IsString()
	@IsNotEmpty()
	requirementName: string;
	@IsString()
	@IsNotEmpty()
	requirementDescription: string;
}


export class CreateRequirements {
	createRequirements: CreateRequirement[];
}