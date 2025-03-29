import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/repositories/athletes.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { TournamentRegistration } from "@prisma/client";

@Injectable()
export class GetTournamentRegistrationByUserIdUseCase {
	constructor(
		@Inject("AthleteRepository")
		private athletesRepository: AthletesRepositoryPort,
	) {}

	async execute(
		userID: string,
	): Promise<ApiResponse<TournamentRegistration[]>> {
		return new ApiResponse<TournamentRegistration[]>(
			HttpStatus.OK,
			"Get Tournament Registration by user id successfully",
			await this.athletesRepository.getTournamentRegistrationByUserId(userID),
		);
	}
}
