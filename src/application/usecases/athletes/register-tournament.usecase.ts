import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/repositories/athletes.repository.port";
import { RegisterTournamentDTO } from "../../../domain/dtos/athletes/register-tournament.dto";
import { TournamentRegistration } from "@prisma/client";

@Injectable()
export class RegisterTournamentUseCase {
	constructor(
		@Inject("AthleteRepository")
		private athletesRepository: AthletesRepositoryPort,
	) {}

	execute(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentRegistration> {
		return this.athletesRepository.registerTournament(registerTournamentDTO);
	}
}
