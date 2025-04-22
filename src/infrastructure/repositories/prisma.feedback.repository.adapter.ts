import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { FeedbackRepositoryPort } from "../../domain/repositories/feedback.repository.port";
import { CreateFeedbackDTO } from "../../domain/dtos/feedback/createFeedback.dto";
import { Feedback } from "@prisma/client";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../domain/interfaces/interfaces";
import {
	DEFAULT_PAGE_NUMBER,
	DEFAULT_PAGE_SIZE,
} from "../constant/pagination.constant";

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
					account: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
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

	async getFeedbackByUser(
		userId: string,
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<Feedback>> {
		try {
			const page: number =
				parseInt(options.page?.toString()) || DEFAULT_PAGE_NUMBER;
			const perPage: number =
				parseInt(options.perPage?.toString()) || DEFAULT_PAGE_SIZE;
			const skip: number = (page - 1) * perPage;

			const [total, feedbacks] = await Promise.all([
				this.prismaService.feedback.count({
					where: {
						accountId: userId,
					},
				}),

				this.prismaService.feedback.findMany({
					where: {
						accountId: userId,
					},
					include: {
						account: {
							select: {
								id: true,
								name: true,
								avatarURL: true,
							},
						},

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
					skip,
					take: perPage,
				}),
			]);

			const lastPage: number = Math.ceil(total / perPage);
			const nextPage: number = page < lastPage ? page + 1 : null;
			const prevPage: number = page > 1 ? page - 1 : null;

			return {
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
		} catch (e) {
			console.error("get feedbacks by user failed: ", e);
			throw e;
		}
	}

	async getUserFeedbackInTournament(
		userId: string,
		tournamentId: string,
	): Promise<Feedback> {
		try {
			return this.prismaService.feedback.findUnique({
				where: {
					tournamentId_accountId: {
						tournamentId,
						accountId: userId,
					},
				},
			});
		} catch (e) {
			console.error("getUserFeedbackInTournament failed: ", e);
			throw e;
		}
	}
}
