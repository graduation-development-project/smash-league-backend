import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { FeedbackRepositoryPort } from "../../domain/repositories/feedback.repository.port";
import { CreateFeedbackDTO } from "../../domain/dtos/feedback/createFeedback.dto";
import { Feedback } from "@prisma/client";

@Injectable()
export class PrismaFeedbackRepositoryAdapter implements FeedbackRepositoryPort {
	constructor(private prismaService: PrismaService) {}

	async createFeedback(feedback: CreateFeedbackDTO): Promise<Feedback> {
		try {
			return this.prismaService.feedback.create({
				data: feedback,
			});
		} catch (e) {
			console.error("create new feedback failed: ", e);
			throw e;
		}
	}

	async getFeedbacksByTournamentId(
		tournamentId: string,
		take: number,
		skip: number,
	): Promise<Feedback[]> {
		try {
			return this.prismaService.feedback.findMany({
				where: {
					tournamentId,
				},

				include: {
					tournament: {
						include: {
							organizer: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
				take,
				skip,
			});
		} catch (e) {
			console.error("get feedbacks by tournament failed: ", e);
			throw e;
		}
	}
}
