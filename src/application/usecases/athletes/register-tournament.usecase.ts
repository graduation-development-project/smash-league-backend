import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepository } from "../../../domain/repositories/athletes.repository";
import { RegisterTournamentDTO } from "../../../infrastructure/dto/athletes/register-tournament.dto";
import { TournamentParticipant } from "@prisma/client";

@Injectable()
export class RegisterTournamentUseCase {
	constructor(
		@Inject("AthleteRepository") private athletesRepository: AthletesRepository,
	) {}

	execute(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentParticipant> {
		return this.athletesRepository.registerTournament(registerTournamentDTO);
	}
}
