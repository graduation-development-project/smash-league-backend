import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/repositories/athletes.repository.port";
import { Tournament } from "@prisma/client";

@Injectable()
export class GetParticipatedTournamentsUseCase {
	constructor(
		@Inject("AthleteRepository") private athletesRepository: AthletesRepositoryPort,
	) {}

	execute(userID: string, tournamentStatus: string): Promise<Tournament[]> {
		return this.athletesRepository.getParticipatedTournaments(
			userID,
			tournamentStatus,
		);
	}
}
