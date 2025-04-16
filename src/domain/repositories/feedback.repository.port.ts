import { CreateFeedbackDTO } from "../dtos/feedback/createFeedback.dto";
import { Feedback } from "@prisma/client";

export interface FeedbackRepositoryPort {
	createFeedback(feedback: CreateFeedbackDTO): Promise<Feedback>;

	getFeedbacksByTournamentId(
		tournamentId: string,
		take: number,
		skip: number,
	): Promise<Feedback[]>;
}
