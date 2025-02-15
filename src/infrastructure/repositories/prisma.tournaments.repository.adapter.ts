import { Injectable } from "@nestjs/common";
import { PrismaClient, Tournament } from "@prisma/client";

import { TournamentsRepositoryPort } from "../../domain/repositories/tournaments.repository";
import { IPaginatedOutput, IPaginateOptions } from "../interfaces/interfaces";
import {
	DEFAULT_PAGE_NUMBER,
	DEFAULT_PAGE_SIZE,
} from "../constant/pagination.constant";

@Injectable()
export class PrismaTournamentsRepositoryAdapter
	implements TournamentsRepositoryPort
{
	constructor(private prisma: PrismaClient) {}

	async searchTournaments(
		searchTerm: string,
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<Tournament>> {
		const page: number =
			parseInt(options.page.toString()) || DEFAULT_PAGE_NUMBER;
		const perPage: number =
			parseInt(options.perPage.toString()) || DEFAULT_PAGE_SIZE;
		const skip: number = (page - 1) * perPage;

		const [total, tournaments] = await Promise.all([
			this.prisma.tournament.count({
				where: {
					OR: [
						{ name: { contains: searchTerm, mode: "insensitive" } },
						{ shortName: { contains: searchTerm, mode: "insensitive" } },
					],
				},
			}),

			this.prisma.tournament.findMany({
				where: {
					OR: [
						{ name: { contains: searchTerm, mode: "insensitive" } },
						{ shortName: { contains: searchTerm, mode: "insensitive" } },
					],
				},
				orderBy: { name: "asc" },
				take: perPage,
				skip: skip,
			}),
		]);

		const lastPage: number = Math.ceil(total / perPage);
		const nextPage: number = page < lastPage ? page + 1 : null;
		const prevPage: number = page > 1 ? page - 1 : null;

		return {
			data: tournaments,
			meta: {
				total,
				lastPage,
				currentPage: page,
				totalPerPage: perPage,
				prevPage,
				nextPage,
			},
		};
	}

	async getTournamentsList(
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<Tournament>> {
		const page: number =
			parseInt(options.page.toString()) || DEFAULT_PAGE_NUMBER;
		const perPage: number =
			parseInt(options.perPage.toString()) || DEFAULT_PAGE_SIZE;
		const skip: number = (page - 1) * perPage;

		const [total, tournaments] = await Promise.all([
			this.prisma.tournament.count(),
			this.prisma.tournament.findMany({
				orderBy: { name: "asc" },
				take: perPage,
				skip,
			}),
		]);

		const lastPage: number = Math.ceil(total / perPage);
		const nextPage: number = page < lastPage ? page + 1 : null;
		const prevPage: number = page > 1 ? page - 1 : null;

		return {
			data: tournaments,
			meta: {
				total,
				lastPage,
				currentPage: page,
				totalPerPage: perPage,
				prevPage,
				nextPage,
			},
		};
	}
}
