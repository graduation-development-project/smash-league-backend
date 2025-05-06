import { Inject, Injectable } from "@nestjs/common";
import { TournamentParticipantsRepositoryPort } from "../../../domain/repositories/tournament-participant.repository.port";

@Injectable()
export class SeedParticipantsUseCase {
	constructor(
		@Inject("TournamentParticipantRepositoryPort")
		private readonly tournamentParticipantsRepository: TournamentParticipantsRepositoryPort,
	) {}

	async execute(tournamentId: string, eventId: string): Promise<void> {
		return this.tournamentParticipantsRepository.seedParticipants(
			tournamentId,
			eventId,
		);
	}
}
