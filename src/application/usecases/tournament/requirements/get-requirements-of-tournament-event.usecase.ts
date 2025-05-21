import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IRequirementResponse } from "src/domain/interfaces/tournament/tournament-requirement.interface";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";
import { TournamentRequirementRepositoryPort } from "src/domain/repositories/tournament-requirement.repository.port";

@Injectable()
export class GetRequirementsOfTournamentEventUseCase {
	constructor(
		@Inject("TournamentRequirementRepository")
		private readonly tournamentRequirementRepository: TournamentRequirementRepositoryPort,
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort
	) {
	}

	async execute(tournamentEventId: string): Promise<ApiResponse<IRequirementResponse[]>> {
		const tournamentEvent = await this.tournamentEventRepository.getTournamentEventById(tournamentEventId);
		if (tournamentEvent === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"No tournament event found!",
			null
		);
		const tournamentEventRequirements = await this.tournamentRequirementRepository.getAllRequirementOfTournamentEvent(tournamentEvent.id);
		if (tournamentEventRequirements.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"No requirement found!",
			null
		);
		return new ApiResponse<IRequirementResponse[]>(
			HttpStatus.OK,
			"Get all requirements success!",
			tournamentEventRequirements
		);
	}
}