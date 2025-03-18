import { ITournamentResponse } from './../../domain/interfaces/tournament/tournament.interface';
import { PrismaClient, Tournament, TournamentStatus } from "@prisma/client";
import { TournamentRepositoryPort } from "src/domain/repositories/tournament.repository.port";
import { Injectable } from "@nestjs/common";
import { ICreateTournament } from "src/domain/interfaces/tournament/tournament.interface";
import {
	DEFAULT_PAGE_NUMBER,
	DEFAULT_PAGE_SIZE,
} from "../constant/pagination.constant";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../domain/interfaces/interfaces";

@Injectable()
export class PrismaTournamentRepositorAdapter
	implements TournamentRepositoryPort
{
	constructor(private prisma: PrismaClient) {}
	calculateTimeLeft(date: Date): string {
		const currentTime = new Date();

		const timeLeft = date.getTime() - currentTime.getTime(); // Difference in milliseconds

		const seconds = Math.floor((timeLeft / 1000) % 60) === 1? "1 second": Math.floor((timeLeft / 1000) % 60) + " seconds";
		const minutes = Math.floor((timeLeft / 1000 / 60) % 60) === 1? "1 minute": Math.floor((timeLeft / 1000 / 60) % 60) + " minutes";
		const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24) === 1? "1 hour": Math.floor((timeLeft / 1000 / 60 / 60) % 24) + " hours";
		const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24) === 1? "1 day": Math.floor((timeLeft / 1000 / 60 / 60 / 24)) + " days";

		console.log(`Time left: ${days} ${hours} ${minutes} ${seconds}`);
		return `${days} ${hours} ${minutes} ${seconds}`;
	}

	async getTournament(id: string): Promise<Tournament | null> {
		return await this.prisma.tournament.findUnique({
			where: {
				id: id,
			},
		});
	}

	async createTournament(tournament: ICreateTournament): Promise<Tournament> {
		return await this.prisma.tournament.create({
			data: {
				...tournament,
				status: TournamentStatus.CREATED, // Make sure this matches TournamentStatus enum
			},
		});
	}

	async searchTournament(
		options: IPaginateOptions,
		searchTerm?: string,
	): Promise<IPaginatedOutput<ITournamentResponse>> {
		try {
			const page: number =
				parseInt(options.page?.toString()) || DEFAULT_PAGE_NUMBER;
			const perPage: number =
				parseInt(options.perPage?.toString()) || DEFAULT_PAGE_SIZE;
			const skip: number = (page - 1) * perPage;

			// Create a where clause that is applied only if searchTerm is provided
			const whereClause = searchTerm
				? {
						OR: [
							{ name: { contains: searchTerm, mode: "insensitive" as const } },
							{
								shortName: {
									contains: searchTerm,
									mode: "insensitive" as const,
								},
							},
						],
					}
				: {};

			const [total, tournaments] = await Promise.all([
				this.prisma.tournament.count({ where: whereClause }),

				this.prisma.tournament.findMany({
					where: whereClause,
					orderBy: { name: "asc" },
					take: perPage,
					skip: skip,
					select: {
						id: true,
						backgroundTournament: true,
						checkInBeforeStart: true,
						registrationOpeningDate: true,
						registrationClosingDate: true,
						drawDate: true,
						startDate: true,
						endDate: true,
						merchandise: true,
						name: true,
						shortName: true,
						mainColor: true,
						organizer: {
							select: {
								id: true,
								name: true,
								avatarURL: true,
								phoneNumber: true,
								email: true,
							}
						},
						numberOfMerchandise: true,
						hasMerchandise: true,
						location: true,
						registrationFeePerPerson: true,
						registrationFeePerPair: true,
						merchandiseImageContent: true,
						maxEventPerPerson: true,
						prizePool: true,
						requiredAttachment: true,
						umpirePerMatch: true,
						protestFeePerTime: true,
						tournamentSerie: true
					}
				}),
			]);

			const timeLeft = this.calculateTimeLeft(tournaments[0].registrationClosingDate);

			const tournamentsResponse = Object.values(tournaments).map((tournament) => ({
				...tournament,
				expiredTimeLeft: this.calculateTimeLeft(tournament.registrationClosingDate)
			}));

			const lastPage: number = Math.ceil(total / perPage);
			const nextPage: number = page < lastPage ? page + 1 : null;
			const prevPage: number = page > 1 ? page - 1 : null;

			return {
				data: tournamentsResponse,
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
			console.error("Get Tournaments failed", e);
			throw e;
		}
	}

	async filterTournament(): Promise<Tournament[]> {
		return await this.prisma.tournament.findMany();
	}

	async getTournamentDetail(tournamentId: string): Promise<Tournament> {
		return await this.prisma.tournament.findUnique({
			where: {
				id: tournamentId,
			},
		});
	}
}
