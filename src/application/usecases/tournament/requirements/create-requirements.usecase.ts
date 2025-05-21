import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Requirement, RequirementType } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { CreateRequirement } from "src/domain/interfaces/tournament/tournament-requirement.validation";
import { TournamentRequirementRepositoryPort } from "src/domain/repositories/tournament-requirement.repository.port";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";

@Injectable()
export class CreateRequirementUseCase {
	constructor(
		@Inject("TournamentRequirementRepository")
		private readonly tournamentRequirementRepository: TournamentRequirementRepositoryPort,
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort
	) {
	}

	async execute(tournamentId: string, createRequirement: CreateRequirement): Promise<ApiResponse<any>> {
		const tournament = await this.tournamentRepository.getTournament(tournamentId);
		if (tournament === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"No tournament found!",
			null
		);
		const tournamentRequirement = await this.tournamentRequirementRepository.createRequirementForTournament({
			...createRequirement, 
			tournamentId: tournamentId,
			requirementType: RequirementType.FillIn
		});
		return new ApiResponse<Requirement>(
			HttpStatus.CREATED,
			"Create new requirement success!",
			tournamentRequirement
		);
	}
}