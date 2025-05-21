import { Requirement } from "@prisma/client";
import { ICreateRequirement, ICreateRequirements, IRequirementResponse } from "../interfaces/tournament/tournament-requirement.interface";

export interface TournamentRequirementRepositoryPort {
	getAllRequirementOfTournament(tournamentId: string): Promise<IRequirementResponse[]>;
	createRequirementForTournament(createTournamentRequirement: ICreateRequirement): Promise<Requirement>;
	createMultipleRequirementsForTournament(createTournamentRequirements: ICreateRequirements): Promise<Requirement[]>;
	updateRequirementForTournament(updateTournamentRequirements: any): Promise<Requirement[]>;
	getAllRequirementOfTournamentEvent(tournamentEventId: string): Promise<IRequirementResponse[]>;
}