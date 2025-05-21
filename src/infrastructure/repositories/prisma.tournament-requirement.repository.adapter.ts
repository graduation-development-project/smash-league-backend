import { Inject, Injectable } from "@nestjs/common";
import { PrismaClient, Requirement, RequirementType } from "@prisma/client";
import { ICreateRequirement, ICreateRequirements, IRequirementResponse } from "src/domain/interfaces/tournament/tournament-requirement.interface";
import { TournamentRequirementRepositoryPort } from "src/domain/repositories/tournament-requirement.repository.port";

@Injectable()
export class PrismaTournamentRequirementRepositoryAdapter implements TournamentRequirementRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	) {
	}
	async createMultipleRequirementsForTournament(createTournamentRequirements: ICreateRequirements): Promise<Requirement[]> {
		return await this.prisma.requirement.createManyAndReturn({
			data: createTournamentRequirements.createRequirements
		});
	}
	async getAllRequirementOfTournament(tournamentId: string): Promise<IRequirementResponse[]> {
		return await this.prisma.requirement.findMany({
			where: {
				tournamentId: tournamentId
			}
		});
	}
	async createRequirementForTournament(createTournamentRequirement: ICreateRequirement): Promise<Requirement> {
		return await this.prisma.requirement.create({
			data: {
				...createTournamentRequirement,
				requirementType: RequirementType.FillIn
			}
		})
	}
	async updateRequirementForTournament(updateTournamentRequirements: any): Promise<Requirement[]> {
		return;
	}


}