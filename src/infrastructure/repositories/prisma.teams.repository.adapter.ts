import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { TeamRepositoryPort } from "../../domain/repositories/team.repository.port";
import { Team, User, UserTeam } from "@prisma/client";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../domain/interfaces/interfaces";
import {
	DEFAULT_PAGE_NUMBER,
	DEFAULT_PAGE_SIZE,
} from "../constant/pagination.constant";

@Injectable()
export class PrismaTeamsRepositoryAdapter implements TeamRepositoryPort {
	constructor(private prismaService: PrismaService) {}

	async getTeamMemberByTeamId(teamId: string): Promise<User[]> {
		try {
			// const userInTeam: UserTeam = await this.prismaService.userTeam.findUnique(
			// 	{
			// 		where: {
			// 			userId_teamId: {
			// 				userId: user.id,
			// 				teamId,
			// 			},
			// 		},
			// 	},
			// );
			//
			// if (!userInTeam) {
			// 	throw new BadRequestException("You are not a member of this teams!");
			// }

			const memberList: { user: User }[] =
				await this.prismaService.userTeam.findMany({
					where: {
						teamId,
					},
					select: {
						user: true,
					},
				});

			return memberList.map((user: { user: User }) => user.user);
		} catch (e) {
			console.error("Get Team member failed", e);
			throw e;
		}
	}

	async getTeamDetails(teamId: string): Promise<Team> {
		try {
			const team: Team = await this.prismaService.team.findUnique({
				where: { id: teamId },
			});

			if (!team) {
				throw new BadRequestException("Team not found.");
			}
			return team;
		} catch (e) {
			console.error("Get Team details failed", e);
			throw e;
		}
	}

	async getJoinedTeam(user: User): Promise<Team[]> {
		try {
			const teamList = await this.prismaService.userTeam.findMany({
				where: {
					userId: user.id,
				},

				include: {
					team: true,
				},
			});

			return teamList.map((userTeam) => userTeam.team);
		} catch (e) {
			console.error("Get Joined Team failed", e);
			throw e;
		}
	}

	async getTeamList(
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<Team>> {
		try {
			const page: number =
				parseInt(options?.page?.toString()) || DEFAULT_PAGE_NUMBER;
			const perPage: number =
				parseInt(options?.perPage?.toString()) || DEFAULT_PAGE_SIZE;
			const skip: number = (page - 1) * perPage;

			const [total, teams] = await Promise.all([
				this.prismaService.team.count({}),

				this.prismaService.team.findMany({
					orderBy: { teamName: "asc" },
					take: perPage,
					skip: skip,
				}),
			]);

			const lastPage: number = Math.ceil(total / perPage);
			const nextPage: number = page < lastPage ? page + 1 : null;
			const prevPage: number = page > 1 ? page - 1 : null;

			return {
				data: teams,
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
			console.error("Get Team list failed", e);
			throw e;
		}
	}

	async searchTeams(
		searchTerm: string,
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<Team>> {
		const page: number =
			parseInt(options?.page?.toString()) || DEFAULT_PAGE_NUMBER;
		const perPage: number =
			parseInt(options?.perPage?.toString()) || DEFAULT_PAGE_SIZE;
		const skip: number = (page - 1) * perPage;

		const [total, teams] = await Promise.all([
			this.prismaService.team.count({
				where: {
					teamName: { contains: searchTerm, mode: "insensitive" },
				},
			}),

			this.prismaService.team.findMany({
				where: {
					teamName: { contains: searchTerm, mode: "insensitive" },
				},
				orderBy: { teamName: "asc" },
				take: perPage,
				skip: skip,
			}),
		]);

		const lastPage: number = Math.ceil(total / perPage);
		const nextPage: number = page < lastPage ? page + 1 : null;
		const prevPage: number = page > 1 ? page - 1 : null;

		return {
			data: teams,
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
