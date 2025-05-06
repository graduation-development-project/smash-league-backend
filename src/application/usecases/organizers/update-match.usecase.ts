import {
	BadRequestException,
	HttpStatus,
	Inject,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { Match, TournamentRegistrationRole } from "@prisma/client";
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
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

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
		@InjectQueue("emailQueue") private emailQueue: Queue,
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

		const oldCourt = matchDetail.courtId;
		const oldUmpire = matchDetail.umpireId;
		let courtInfo = null

		if (dataToUpdate.umpireId) {
			const umpireDetail: any = await this.umpireRepository.getUmpireDetail(
				dataToUpdate.umpireId,
				matchDetail.tournamentEvent.tournamentId,
			);

			if (oldUmpire !== dataToUpdate.umpireId) {
				if (!umpireDetail)
					throw new BadRequestException("This umpire not in tournament");

				if (!umpireDetail.isAvailable)
					throw new BadRequestException(
						"This umpire is not available for this match",
					);

				if (oldUmpire !== null) {
					const oldUmpireDetail: any =
						await this.umpireRepository.getUmpireDetail(
							oldUmpire,
							matchDetail.tournamentEvent.tournamentId,
						);

					const notification: CreateNotificationDTO = {
						title: `Match Unassignment - ${matchDetail.tournamentEvent.tournament.name} - ${matchDetail.tournamentEvent.tournamentEvent}`,
						message: `You have been unassigned from officiating the match in tournament ${matchDetail.tournamentEvent.tournament.name} - ${matchDetail.tournamentEvent.tournamentEvent}. Please check your schedule for updates.`,
					};
					await this.notificationsRepository.createNotification(notification, [
						oldUmpire,
					]);

					await this.emailQueue.add("sendEmail", {
						to: oldUmpireDetail.user.email,
						subject: "Match Assignment Notification",
						template: "assign-umpire.hbs",
						context: {
							umpireName: oldUmpireDetail.user.name,
							isAssigned: false,
							tournamentName: matchDetail.tournamentEvent.tournament.name,
							tournamentEvent: matchDetail.tournamentEvent.tournamentEvent,
							matchNumber: matchDetail.matchNumber,
							// matchTime: matchDetail.startedWhen,
							// matchVenue: matchDetail.court.courtCode,
						},
					});

					await this.umpireRepository.updateUmpireAvailability(
						oldUmpire,
						matchDetail.tournamentEvent.tournamentId,
						true,
					);
				}

				const notification: CreateNotificationDTO = {
					title: `Match Assignment - ${matchDetail.tournamentEvent.tournament.name} - ${matchDetail.tournamentEvent.tournamentEvent}`,
					message: `You have been assigned from officiating the match in tournament ${matchDetail.tournamentEvent.tournament.name} - ${matchDetail.tournamentEvent.tournamentEvent}. Please check your schedule for updates.`,
				};

				await this.notificationsRepository.createNotification(notification, [
					dataToUpdate.umpireId,
				]);

				await this.emailQueue.add("sendEmail", {
					to: umpireDetail.user.email,
					subject: "Match Assignment Notification",
					template: "assign-umpire.hbs",
					context: {
						umpireName: umpireDetail.user.name,
						isAssigned: true,
						tournamentName: matchDetail.tournamentEvent.tournament.name,
						tournamentEvent: matchDetail.tournamentEvent.tournamentEvent,
						matchNumber: matchDetail.matchNumber,

					},
				});
			}

			await this.umpireRepository.updateUmpireAvailability(
				dataToUpdate.umpireId,
				matchDetail.tournamentEvent.tournamentId,
				false,
			);
		}

		if (dataToUpdate.courtId) {
			const courtDetail = await this.courtRepository.getCourtDetail(
				dataToUpdate.courtId,
			);

			courtInfo = courtDetail.courtCode

			if (oldCourt !== dataToUpdate.courtId) {
				if (!courtDetail) throw new NotFoundException("Court not found");

				if (!courtDetail.courtAvailable)
					throw new BadRequestException(
						"Court is not available for this match",
					);

				if (oldCourt !== null) {
					await this.courtRepository.updateCourtAvailability(oldCourt, true);
				}
			}

			await this.courtRepository.updateCourtAvailability(courtDetail.id, false);
		}

		if (matchDetail.isByeMatch) {
			const numberOfMatch =
				await this.matchRepository.countMatchesOfLastStage(matchId);

			const isInLowerHalf =
				matchDetail.matchNumber > Math.floor(numberOfMatch / 2);

			if (isInLowerHalf) {
				if (
					updateMatchDTO.leftCompetitorId !== undefined &&
					updateMatchDTO.leftCompetitorId !== null
				) {
					return new ApiResponse<null>(
						HttpStatus.BAD_REQUEST,
						"This match cannot have left competitor!",
						null,
					);
				}
				if (
					updateMatchDTO.rightCompetitorId === null ||
					updateMatchDTO.rightCompetitorId === undefined
				) {
					return new ApiResponse<null>(
						HttpStatus.BAD_REQUEST,
						"Right competitor is null!",
						null,
					);
				}
			} else {
				if (
					updateMatchDTO.rightCompetitorId !== undefined &&
					updateMatchDTO.rightCompetitorId !== null
				) {
					return new ApiResponse<null>(
						HttpStatus.BAD_REQUEST,
						"This match cannot have right competitor!",
						null,
					);
				}
				if (
					updateMatchDTO.leftCompetitorId === null ||
					updateMatchDTO.leftCompetitorId === undefined
				) {
					return new ApiResponse<null>(
						HttpStatus.BAD_REQUEST,
						"Left competitor is null!",
						null,
					);
				}
			}
		}

		const updatedLeftCompetitorId =
			dataToUpdate.leftCompetitorId ?? matchDetail.leftCompetitorId;
		const updatedRightCompetitorId =
			dataToUpdate.rightCompetitorId ?? matchDetail.rightCompetitorId;
		const updatedStartTime =
			dataToUpdate.startedWhen ?? matchDetail.startedWhen;

		const hasStartTime = !!matchDetail.startedWhen;
		const isNotByeMatch = !matchDetail.isByeMatch;

		const isAssignedBefore =
			!!matchDetail.leftCompetitorId && !!matchDetail.rightCompetitorId;
		const isAssignedNow =
			!!updatedLeftCompetitorId && !!updatedRightCompetitorId;

		const shouldNotifyAssigned =
			isNotByeMatch && hasStartTime && isAssignedNow && !isAssignedBefore;

		const isSameTime =
			new Date(updatedStartTime).getTime() ===
			new Date(matchDetail.startedWhen).getTime();

		const shouldNotifyUpdated =
			isNotByeMatch &&
			isAssignedBefore &&
			hasStartTime &&
			(!isSameTime ||
				updatedLeftCompetitorId !== matchDetail.leftCompetitorId ||
				updatedRightCompetitorId !== matchDetail.rightCompetitorId ||
				(dataToUpdate.courtId !== undefined &&
					dataToUpdate.courtId !== matchDetail.courtId));

		console.log(
			updatedStartTime,
			matchDetail.startedWhen,
			updatedStartTime !== matchDetail.startedWhen,
		);
		console.log(
			updatedLeftCompetitorId,
			matchDetail.leftCompetitorId,
			updatedLeftCompetitorId !== matchDetail.leftCompetitorId,
		);
		console.log(
			updatedRightCompetitorId,
			matchDetail.rightCompetitorId,
			updatedRightCompetitorId !== matchDetail.rightCompetitorId,
		);

		console.log(
			dataToUpdate.courtId,
			matchDetail.courtId,
			dataToUpdate.courtId !== undefined &&
				dataToUpdate.courtId !== matchDetail.courtId,
		);

		if (shouldNotifyAssigned || shouldNotifyUpdated) {
			const notification: CreateNotificationDTO = {
				title: shouldNotifyAssigned
					? `Match Assigned - ${matchDetail.tournamentEvent.tournament.name}`
					: `Match Updated - ${matchDetail.tournamentEvent.tournament.name}`,
				message: shouldNotifyAssigned
					? `You have been assigned to a match in tournament ${matchDetail.tournamentEvent.tournament.name} - ${matchDetail.tournamentEvent.tournamentEvent}. It will take place at ${getCurrentTime(updatedStartTime)} on ${formatDate(updatedStartTime)}.`
					: `The details of your match in tournament ${matchDetail.tournamentEvent.tournament.name} - ${matchDetail.tournamentEvent.tournamentEvent} have been updated. Please check for the latest time, court, or opponent information.`,
			};

			const leftCompetitor: any =
				await this.tournamentParticipantsRepository.getTournamentParticipantDetail(
					updatedLeftCompetitorId,
				);
			const rightCompetitor: any =
				await this.tournamentParticipantsRepository.getTournamentParticipantDetail(
					updatedRightCompetitorId,
				);

			await this.notificationsRepository.createNotification(notification, [
				leftCompetitor.userId,
				rightCompetitor.userId,
			]);


			await this.emailQueue.add("sendEmail", {
				to: leftCompetitor.user.email,
				subject: "Match Assignment Notification",
				template: "assign-athlete.hbs",
				context: {
					athleteName: leftCompetitor.user.name,
					isUpdate: shouldNotifyUpdated,
					tournamentName: matchDetail.tournamentEvent.tournament.name,
					tournamentEvent: matchDetail.tournamentEvent.tournamentEvent,
					matchNumber: matchDetail.matchNumber,
					matchTime: `${getCurrentTime(updatedStartTime)} on ${formatDate(updatedStartTime)}`,
					matchVenue: courtInfo
				},
			});

			await this.emailQueue.add("sendEmail", {
				to: rightCompetitor.user.email,
				subject: "Match Assignment Notification",
				template: "assign-athlete.hbs",
				context: {
					athleteName: rightCompetitor.user.name,
					isUpdate: shouldNotifyUpdated,
					tournamentName: matchDetail.tournamentEvent.tournament.name,
					tournamentEvent: matchDetail.tournamentEvent.tournamentEvent,
					matchNumber: matchDetail.matchNumber,
					matchTime: `${getCurrentTime(updatedStartTime)} on ${formatDate(updatedStartTime)}`,
					matchVenue: courtInfo
				},
			});

		}

		if (
			updatedLeftCompetitorId !== matchDetail.leftCompetitorId &&
			matchDetail.leftCompetitorId &&
			hasStartTime
		) {
			const removedLeftPlayer =
				await this.tournamentParticipantsRepository.getTournamentParticipantDetail(
					matchDetail.leftCompetitorId,
				);

			const removalNotification: CreateNotificationDTO = {
				title: `Update: You've been removed from a match`,
				message: `You have been removed from a match in ${matchDetail.tournamentEvent.tournament.name} - ${matchDetail.tournamentEvent.tournamentEvent}. Please check for further updates.`,
			};

			await this.notificationsRepository.createNotification(
				removalNotification,
				[removedLeftPlayer.userId],
			);
		}

		if (
			updatedRightCompetitorId !== matchDetail.rightCompetitorId &&
			matchDetail.rightCompetitorId &&
			hasStartTime
		) {
			const removedRightPlayer =
				await this.tournamentParticipantsRepository.getTournamentParticipantDetail(
					matchDetail.rightCompetitorId,
				);

			const removalNotification: CreateNotificationDTO = {
				title: `Update: You've been removed from a match`,
				message: `You have been removed from a match in ${matchDetail.tournamentEvent.tournament.name} - ${matchDetail.tournamentEvent.tournamentEvent}. Please check for further updates.`,
			};

			await this.notificationsRepository.createNotification(
				removalNotification,
				[removedRightPlayer.userId],
			);
		}

		return new ApiResponse(
			HttpStatus.OK,
			"Update Match Detail Successfully",
			await this.matchRepository.updateMatch(matchId, updateMatchDTO),
		);
	}
}
