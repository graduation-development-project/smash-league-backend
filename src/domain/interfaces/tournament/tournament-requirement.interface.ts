import { RequirementType } from "@prisma/client";

export interface ICreateRequirement {
	requirementName: string;
	requirementDescription: string;
	requirementType: RequirementType;
	tournamentId: string;
}

export interface ICreateRequirements {
	createRequirements: ICreateRequirement[];
}

export interface IRequirementResponse {
	id: string;
	requirementName: string;
	requirementDescription: string;
}