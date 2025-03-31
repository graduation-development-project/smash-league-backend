import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/interfaces/repositories/athletes.repository.port";
import { RegisterTournamentDTO } from "../../../domain/dtos/athletes/register-tournament.dto";
import { TournamentRegistration } from "@prisma/client";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class RegisterTournamentUseCase {
	constructor(
		@Inject("AthleteRepository")
		private athletesRepository: AthletesRepositoryPort,
	) {}

	async execute(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<ApiResponse<TournamentRegistration>> {
		return new ApiResponse<TournamentRegistration>(
			HttpStatus.CREATED,
			"Register to tournament successfully",
			await this.athletesRepository.registerTournament(registerTournamentDTO),
		);
	}
}
