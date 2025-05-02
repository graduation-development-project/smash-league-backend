import { UpdateTournamentScheduleInformation } from "./../../../domain/interfaces/tournament/tournament.validation";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Tournament } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";
import { checkIfOverOneMonth } from "src/infrastructure/util/date-comparation.util";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { scheduleOrUpdateTournamentJob } from "../../../infrastructure/util/job/tournament-scheduler";
import { TournamentTimeJobType } from "../../../infrastructure/enums/tournament-time-job.enum";

@Injectable()
export class UpdateTournamentScheduleInformationUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
		@InjectQueue("tournamentQueue")
		private tournamentQueue: Queue,
	) {}

	async execute(
		updateTournamentScheduleInformation: UpdateTournamentScheduleInformation,
	): Promise<ApiResponse<any>> {
		const tournament = await this.tournamentRepository.getTournament(
			updateTournamentScheduleInformation.id,
		);
		if (tournament === null)
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"Tournament not found!",
				null,
			);

		console.log(
			updateTournamentScheduleInformation.startDate,
			updateTournamentScheduleInformation.endDate,
		);

		if (updateTournamentScheduleInformation.startDate) {
			await scheduleOrUpdateTournamentJob(
				this.tournamentQueue,
				TournamentTimeJobType.START_TOURNAMENT,
				tournament.id,
				new Date(updateTournamentScheduleInformation.startDate),
			);
		}

		if (updateTournamentScheduleInformation.endDate) {
			await scheduleOrUpdateTournamentJob(
				this.tournamentQueue,
				TournamentTimeJobType.END_TOURNAMENT,
				tournament.id,
				new Date(updateTournamentScheduleInformation.endDate),
			);
		}

		//console.log(checkIfOverOneMonth(tournament.startDateFirstTime, updateTournamentScheduleInformation.startDate));
		if (
			checkIfOverOneMonth(
				tournament.startDateFirstTime,
				updateTournamentScheduleInformation.startDate,
			)
		)
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"Your start date is far from 1 month with the last time you create the tournament.",
				null,
			);
		if (
			checkIfOverOneMonth(
				tournament.endDateFirstTime,
				updateTournamentScheduleInformation.endDate,
			)
		)
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"Your end date is far from 1 month with the last time you create the tournament.",
				null,
			);
		if (tournament.countUpdateOccurTime >= 3)
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"Tournament schedule cannot be update more than 3 times",
				null,
			);
		return new ApiResponse<Tournament>(
			HttpStatus.NO_CONTENT,
			"Tournament schedule information updated successful!",
			await this.tournamentRepository.updateTournamentScheduleInformation(
				updateTournamentScheduleInformation,
			),
		);
	}
}
