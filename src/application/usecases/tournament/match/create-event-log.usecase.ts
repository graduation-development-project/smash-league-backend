import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { LogType, MatchLog } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { CreateLogEventDto } from "src/domain/dtos/match/create-log-event.dto";
import { GameRepositoryPort } from "src/domain/repositories/game.repository.port";
import { MatchLogRepositoryPort } from "src/domain/repositories/match-log.repository.port";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";

@Injectable()
export class CreateEventLogUseCase {
	constructor(
		@Inject("MatchLogRepositoryPort")
		private readonly matchLogRepository: MatchLogRepositoryPort,
		@Inject("MatchRepository")
		private readonly matchRepository: MatchRepositoryPort,
		@Inject("GameRepository")
		private readonly gameRepository: GameRepositoryPort
	) {
	}

	async execute(createLogEvent: CreateLogEventDto): Promise<ApiResponse<MatchLog>> {
		const game = await this.gameRepository.getGame(createLogEvent.gameId);
		if (game === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Game not found!",
			null
		);
		if (createLogEvent.logType === LogType.INTERVAL) return new ApiResponse<MatchLog>(
			HttpStatus.CREATED,
			"Create new log for game success!",
			await this.matchLogRepository.setMatchInterval({
				...createLogEvent,
				time: new Date()
			})
		);
		return new ApiResponse<MatchLog>(
			HttpStatus.CREATED,
			"Create new log for game success!",
			await this.matchLogRepository.createEventLogForGame({
				...createLogEvent,
				time: new Date()
			})
		);
	}
}