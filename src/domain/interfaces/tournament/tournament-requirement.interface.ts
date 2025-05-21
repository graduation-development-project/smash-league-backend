export interface ICreateRequirement {
	requirementName: string;
	requirementDescription: string;
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