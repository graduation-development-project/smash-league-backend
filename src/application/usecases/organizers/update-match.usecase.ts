import {
	BadRequestException,
	HttpStatus,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { Match } from "@prisma/client";
import { MatchRepositoryPort } from "../../../domain/repositories/match.repository.port";
import { UpdateMatchDTO } from "../../../domain/dtos/match/update-match.dto";
import { UmpireRepositoryPort } from "../../../domain/repositories/umpire.repository.port";
import { CourtRepositoryPort } from "../../../domain/repositories/court.repository.port";
import { NotificationsRepositoryPort } from "../../../domain/repositories/notifications.repository.port";
import { CreateNotificationDTO } from "../../../domain/dtos/notifications/create-notification.dto";
import {
	formatDate,
	getCurrentTime,
} from "../../../infrastructure/util/format-date-time.util";
import { TournamentParticipantsRepositoryPort } from "../../../domain/repositories/tournament-participant.repository.port";

@Injectable()
export class UpdateMatchUseCase {
	constructor(
		@Inject("MatchRepository")
		private matchRepository: MatchRepositoryPort,
		@Inject("UmpireRepository")
		private umpireRepository: UmpireRepositoryPort,
		@Inject("CourtRepository")
		private courtRepository: CourtRepositoryPort,
		@Inject("NotificationRepository")
		private readonly notificationsRepository: NotificationsRepositoryPort,
		@Inject("TournamentParticipantRepositoryPort")
		private readonly tournamentParticipantsRepository: TournamentParticipantsRepositoryPort,
	) {}

	async execute(
		matchId: string,
		updateMatchDTO: UpdateMatchDTO,
	): Promise<ApiResponse<Match>> {
		const dataToUpdate: Partial<Match> = {};

		for (const [key, value] of Object.entries(updateMatchDTO)) {
			if (value !== null && value !== undefined) {
				dataToUpdate[key] = value;
			}
		}

		const matchDetail: any = await this.matchRepository.getMatchDetail(matchId);

		if (!matchDetail) throw new NotFoundException("Match not found");

		console.log(matchDetail);

		if (dataToUpdate.umpireId) {
			const umpireDetail = await this.umpireRepository.getUmpireDetail(
				dataToUpdate.umpireId,
				matchDetail.tournamentEvent.tournamentId,
			);
			if (!umpireDetail)
				throw new BadRequestException("This umpire not in tournament");

			if (!umpireDetail.isAvailable)
				throw new BadRequestException(
					"This umpire is not available for this match",
				);
		}

		if (dataToUpdate.courtId) {
			const courtDetail = await this.courtRepository.getCourtDetail(
				dataToUpdate.courtId,
			);

			if (!courtDetail) throw new NotFoundException("Court not found");

			if (!courtDetail.courtAvailable)
				throw new BadRequestException("Court is not available for this match");
		}

		const updatedLeftCompetitorId =
			dataToUpdate.leftCompetitorId ?? matchDetail.leftCompetitorId;
		const updatedRightCompetitorId =
			dataToUpdate.rightCompetitorId ?? matchDetail.rightCompetitorId;
		const updatedStartTime =
			dataToUpdate.startedWhen ?? matchDetail.startedWhen;

		const shouldNotify =
			updatedLeftCompetitorId && updatedRightCompetitorId && updatedStartTime;

		if (shouldNotify) {
			const notification: CreateNotificationDTO = {
				title: `Upcoming Match in ${matchDetail.tournamentEvent.tournament.name} - ${matchDetail.tournamentEvent.tournamentEvent}`,
				message: `Reminder: Your match in ${matchDetail.tournamentEvent.tournament.name} - ${matchDetail.tournamentEvent.tournamentEvent} is scheduled for ${getCurrentTime(updatedStartTime)} on ${formatDate(updatedStartTime)}`,
			};

			const leftCompetitor =
				await this.tournamentParticipantsRepository.getTournamentParticipantDetail(
					updatedLeftCompetitorId,
				);
			const rightCompetitor =
				await this.tournamentParticipantsRepository.getTournamentParticipantDetail(
					updatedRightCompetitorId,
				);

			await this.notificationsRepository.createNotification(notification, [
				leftCompetitor.userId,
				rightCompetitor.userId,
			]);
		}

		return new ApiResponse(
			HttpStatus.OK,
			"Update Match Detail Successfully",
			await this.matchRepository.updateMatch(matchId, updateMatchDTO),
		);
	}
}
