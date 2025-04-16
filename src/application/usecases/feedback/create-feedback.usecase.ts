import {
	BadRequestException,
	HttpStatus,
	Inject,
	Injectable,
} from "@nestjs/common";
import { FeedbackRepositoryPort } from "../../../domain/repositories/feedback.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { Feedback } from "@prisma/client";
import { TournamentParticipantsRepositoryPort } from "../../../domain/repositories/tournament-participant.repository.port";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";
import { TournamentStatus } from "../../../infrastructure/enums/tournament/tournament-status.enum";
import { CreateFeedbackDTO } from "../../../domain/dtos/feedback/createFeedback.dto";

@Injectable()
export class CreateFeedbackUseCase {
	constructor(
		@Inject("FeedbackRepositoryPort")
		private feedbackRepository: FeedbackRepositoryPort,
		@Inject("TournamentParticipantRepositoryPort")
		private tournamentParticipantRepository: TournamentParticipantsRepositoryPort,
		@Inject("TournamentRepository")
		private tournamentRepository: TournamentRepositoryPort,
	) {}

	async execute(
		createFeedbackDTO: CreateFeedbackDTO,
	): Promise<ApiResponse<Feedback>> {
		const { tournamentId, accountId } = createFeedbackDTO;

		const tournamentExisted =
			await this.tournamentRepository.getTournament(tournamentId);

		if (!tournamentExisted) {
			throw new BadRequestException("This tournament not existed");
		}

		if (tournamentExisted.status !== TournamentStatus.FINISHED) {
			throw new BadRequestException(
				"Tournament must finished before creating feedback",
			);
		}

		const checkUserParticipated =
			await this.tournamentParticipantRepository.getParticipantInTournament(
				tournamentId,
				accountId,
			);

		if (checkUserParticipated.length <= 0) {
			throw new BadRequestException(
				"You must participated in this tournament to feedback",
			);
		}

		return new ApiResponse<Feedback>(
			HttpStatus.CREATED,
			"Create Feedback successfully",
			await this.feedbackRepository.createFeedback(createFeedbackDTO),
		);
	}
}
