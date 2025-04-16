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
}
