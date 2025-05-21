import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IRequirementResponse } from "src/domain/interfaces/tournament/tournament-requirement.interface";
import { TournamentRequirementRepositoryPort } from "src/domain/repositories/tournament-requirement.repository.port";

@Injectable()
export class GetRequirementsOfTournamentUseCase {
	constructor(
		@Inject("TournamentRequirementRepository")
		private readonly tournamentRequirementRepository: TournamentRequirementRepositoryPort
	) {
	}

	async execute(tournamentId: string): Promise<ApiResponse<IRequirementResponse[]>> {
		const requirements = await this.tournamentRequirementRepository.getAllRequirementOfTournament(tournamentId);
		if (requirements.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"No requirements found!",
			null
		);
		return new ApiResponse<IRequirementResponse[]>(
			HttpStatus.OK,
			"Get all requirements success!",
			requirements
		);
	}
}