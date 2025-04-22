import { CreateFeedbackDTO } from "../dtos/feedback/createFeedback.dto";
import { Feedback } from "@prisma/client";
import { IPaginatedOutput, IPaginateOptions } from "../interfaces/interfaces";

export interface FeedbackRepositoryPort {
	createFeedback(feedback: CreateFeedbackDTO): Promise<Feedback>;

	getFeedbacksByTournamentId(
		tournamentId: string,
		take: number,
		skip: number,
	): Promise<Feedback[]>;

	getFeedbackByUser(
		userId: string,
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<Feedback>>;

	getUserFeedbackInTournament(
		userId: string,
		tournamentId: string,
	): Promise<Feedback>;
}
