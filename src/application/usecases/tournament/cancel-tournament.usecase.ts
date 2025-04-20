import { ApiResponse } from "../../../domain/dtos/api-response";
import { BadRequestException, HttpStatus, Inject } from "@nestjs/common";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";
import { TournamentEventStatus } from "@prisma/client";
import { getRegistrationFee } from "../../../infrastructure/util/get-registration-fee.util";
import { PaybackFeeListRepositoryPort } from "../../../domain/repositories/payback-fee-list.repository.port";
import { TournamentEventRepositoryPort } from "../../../domain/repositories/tournament-event.repository.port";
import { PrismaService } from "../../../infrastructure/services/prisma.service";

export class CancelTournamentUseCase {
	constructor(
		private prismaService: PrismaService,
		@Inject("TournamentRepository")
		private tournamentRepository: TournamentRepositoryPort,
		@Inject("PaybackFeeListRepositoryPort")
		private paybackFeeListRepository: PaybackFeeListRepositoryPort,
		@Inject("TournamentEventRepository")
		private tournamentEventRepositoryPort: TournamentEventRepositoryPort,
	) {}

	async execute(tournamentId: string): Promise<ApiResponse<null>> {
		const tournament =
			await this.tournamentRepository.getTournament(tournamentId);

		if (!tournament) {
			throw new BadRequestException("Tournament not found");
		}

		const updatedTournament =
			await this.tournamentRepository.cancelTournament(tournamentId);

		const tournamentEvents = await this.prismaService.tournamentEvent.findMany({
			where: {
				tournamentId,
			},

			include: {
				tournamentParticipants: true,
				tournament: true,
			},
		});

		for (const event of tournamentEvents) {
			console.log(event);
			const paybackRecords = event.tournamentParticipants.map(
				(participant) => ({
					userId: participant.userId,
					tournamentId: tournament.id,
					tournamentEventId: event.id,
					value: getRegistrationFee(event),
				}),
			);

			if (paybackRecords.length > 0) {
				await this.paybackFeeListRepository.createManyPaybackFee(
					paybackRecords,
				);
			}
		}

		return new ApiResponse(
			HttpStatus.NO_CONTENT,
			"Cancel Tournament Successfully",
			null,
		);
	}
}
