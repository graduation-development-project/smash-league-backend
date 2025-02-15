import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepository } from "../../../domain/repositories/athletes.repository";
import { Tournament } from "@prisma/client";

@Injectable()
export class GetParticipatedTournamentsUseCase {
	constructor(
		@Inject("AthleteRepository") private athletesRepository: AthletesRepository,
	) {}

	execute(userID: string, tournamentStatus: string): Promise<Tournament[]> {
		return this.athletesRepository.getParticipatedTournaments(
			userID,
			tournamentStatus,
		);
	}
}
