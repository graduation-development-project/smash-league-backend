import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { FeedbackRepositoryPort } from "../../../domain/repositories/feedback.repository.port";
import { CreateFeedbackDTO } from "../../../domain/dtos/feedback/createFeedback.dto";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { Feedback } from "@prisma/client";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../../domain/interfaces/interfaces";
import {
	DEFAULT_PAGE_NUMBER,
	DEFAULT_PAGE_SIZE,
} from "../../../infrastructure/constant/pagination.constant";

@Injectable()
export class GetFeedbacksByTournamentUseCase {
	constructor(
		@Inject("FeedbackRepositoryPort")
		private feedbackRepository: FeedbackRepositoryPort,
	) {}

	async execute(
		options: IPaginateOptions,
		tournamentId: string,
	): Promise<ApiResponse<IPaginatedOutput<Feedback>>> {
		const page: number =
			parseInt(options.page?.toString()) || DEFAULT_PAGE_NUMBER;
		const perPage: number =
			parseInt(options.perPage?.toString()) || DEFAULT_PAGE_SIZE;
		const skip: number = (page - 1) * perPage;

		const feedbacks =
			await this.feedbackRepository.getFeedbacksByTournamentId(tournamentId, perPage, skip);

		const total = feedbacks.length;

		const lastPage: number = Math.ceil(total / perPage);
		const nextPage: number = page < lastPage ? page + 1 : null;
		const prevPage: number = page > 1 ? page - 1 : null;

		const returnData = {
			data: feedbacks,
			meta: {
				total,
				lastPage,
				currentPage: page,
				totalPerPage: perPage,
				prevPage,
				nextPage,
			},
		};

		return new ApiResponse<IPaginatedOutput<Feedback>>(
			HttpStatus.OK,
			"Get Feedbacks by tournament successfully",
			returnData,
		);
	}
}
