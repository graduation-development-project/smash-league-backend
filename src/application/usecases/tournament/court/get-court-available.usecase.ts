import { HttpStatus, Inject } from "@nestjs/common";
import { Court } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { CourtRepositoryPort } from "src/domain/repositories/court.repository.port";

export class GetCourtAvailableUseCase {
	constructor(
		@Inject("CourtRepository")
		private readonly courtRepository: CourtRepositoryPort
	){
	}

	async execute(tournamentId: string): Promise<ApiResponse<Court[]>> {
		const courts = await this.courtRepository.getCourtAvailable(tournamentId);
		if (courts.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.OK,
			"No court is available now!",
			null
		);
		return new ApiResponse<Court[]>(
			HttpStatus.OK,
			"Get all courts available successful!",
			courts
		);
	}
}