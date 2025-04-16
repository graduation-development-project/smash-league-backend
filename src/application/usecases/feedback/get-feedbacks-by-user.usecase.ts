import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { FeedbackRepositoryPort } from "../../../domain/repositories/feedback.repository.port";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../../domain/interfaces/interfaces";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { Feedback } from "@prisma/client";

@Injectable()
export class GetFeedbacksByUserUseCase {
	constructor(
		@Inject("FeedbackRepositoryPort")
		private feedbackRepository: FeedbackRepositoryPort,
	) {}

	async execute(
		userId: string,
		options: IPaginateOptions,
	): Promise<ApiResponse<IPaginatedOutput<Feedback>>> {
		return new ApiResponse<IPaginatedOutput<Feedback>>(
			HttpStatus.OK,
			"Get feedbacks by user successfully",
			await this.feedbackRepository.getFeedbackByUser(userId, options),
		);
	}
}
