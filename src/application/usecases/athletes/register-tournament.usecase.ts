import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/repositories/athletes.repository.port";
import { RegisterTournamentDTO } from "../../../infrastructure/dto/athletes/register-tournament.dto";
import { TournamentParticipant } from "@prisma/client";

@Injectable()
export class RegisterTournamentUseCase {
	constructor(
		@Inject("AthleteRepository") private athletesRepository: AthletesRepositoryPort,
	) {}

	execute(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentParticipant> {
		return this.athletesRepository.registerTournament(registerTournamentDTO);
	}
}
