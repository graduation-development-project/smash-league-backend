import {
	ITournamentContact,
	ITournamentDetailResponse,
	ITournamentInformation,
	ITournamentResponse,
	IUpdateTournament,
	IUpdateTournamentContact,
	IUpdateTournamentInformation,
	IUpdateTournamentRegistrationInformation,
} from "./../../domain/interfaces/tournament/tournament.interface";
import {
	BadmintonParticipantType,
	PrismaClient,
	Tournament,
	TournamentPost,
	TournamentStatus,
	TournamentUmpires,
} from "@prisma/client";
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
	async updateTournamentRegistrationInformation(updateTournamentRegistration: IUpdateTournamentRegistrationInformation): Promise<Tournament> {
		return await this.prisma.tournament.update({
			where: {
				id: updateTournamentRegistration.id
			},
			data: {
				...updateTournamentRegistration
			}
		});
	}
	async getTournamentContact(id: string): Promise<ITournamentContact> {
		return await this.prisma.tournament.findUnique({
			where: {
				id: id
			},
			select: {
				id: true,
				contactEmail: true,
				contactPhone: true
			}
		});
	}
	async getTournamentInformation(id: string): Promise<ITournamentInformation> {
		return await this.prisma.tournament.findUnique({
			where: {
				id: id
			},
			select: {
				id: true,
				name: true,
				shortName: true,
				backgroundTournament: true,
				mainColor: true,
				description: true,
				introduction: true,
				prizePool: true,
				location: true
			}
		});
	}
	async updateTournamentContact(updateContact: IUpdateTournamentContact): Promise<Tournament> {
		return await this.prisma.tournament.update({
			where: {
				id: updateContact.id
			},
			data: {
				...updateContact
			}
		});
	}
	async updateTournamentInformation(updateTournament: IUpdateTournamentInformation): Promise<Tournament> {
		return await this.prisma.tournament.update({
			where: {
				id: updateTournament.id
			},
			data: {
				...updateTournament
			}
		});
	}

	async updateTournament(
		updateTournament: IUpdateTournament,
	): Promise<Tournament> {
		return await this.prisma.tournament.update({
			where: {
				id: updateTournament.id,
			},
			data: {
				...updateTournament,
			},
		});
	}

	calculateTimeDetailLeft(date: Date): string {
		const now = new Date();
		const currentTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
		if (date.getTime() < currentTime.getTime()) return "Expired!";
		const timeLeft = date.getTime() - currentTime.getTime(); // Difference in milliseconds

		const seconds = Math.floor((timeLeft / 1000) % 60);
		const secondsString =
			seconds > 1 ? seconds + " seconds" : seconds === 0 ? "" : "1 second";
		const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
		const minutesString =
			minutes > 1 ? minutes + " minutes " : minutes === 0 ? "" : "1 minute ";
		const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
		const hoursString =
			hours > 1 ? hours + " hours " : hours === 0 ? "" : "1 hour ";
		const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24);
		const daysString = days > 1 ? days + " days " : days === 0 ? "" : "1 day ";
		return `${daysString}${hoursString}${minutesString}${secondsString} left`;
	}

	calculateTimeLeft(date: Date): string {
		const now = new Date();
		const currentTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
		console.log(currentTime);

		const timeLeft = date.getTime() - currentTime.getTime(); // Difference in milliseconds

		const seconds = Math.floor((timeLeft / 1000) % 60);
		const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
		const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
		const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24);

		let result = "";
		if (days > 0) {
			result = days === 1 ? "1 day" : `${days} days`;
		} else if (hours > 0) {
			result = hours === 1 ? "1 hour" : `${hours} hours`;
		} else if (minutes > 0) {
			result = minutes === 1 ? "1 minute" : `${minutes} minutes`;
		} else {
			result = seconds === 1 ? "1 second" : `${seconds} seconds`;
		}
		return result + " left";
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
						status: { not: TournamentStatus.FINISHED },

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
				: {
						status: { not: TournamentStatus.FINISHED },
					};

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
							},
						},
						numberOfMerchandise: true,
						hasMerchandise: true,
						location: true,
						registrationFeePerPerson: true,
						registrationFeePerPair: true,
						merchandiseImages: true,
						maxEventPerPerson: true,
						prizePool: true,
						requiredAttachment: true,
						umpirePerMatch: true,
						protestFeePerTime: true,
						tournamentSerie: {
							select: {
								id: true,
								belongsToUser: {
									select: {
										id: true,
										name: true,
										email: true,
										phoneNumber: true,
									},
								},
								tournamentSerieName: true,
								serieBackgroundImageURL: true,
							},
						},
					},
				}),
			]);

			// const timeLeft = this.calculateTimeLeft(tournaments[0].registrationClosingDate);

			const tournamentsResponse = Object.values(tournaments).map(
				(tournament) => ({
					...tournament,
					expiredTimeLeft: this.calculateTimeLeft(
						tournament.registrationClosingDate,
					),
				}),
			);

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

	async getTournamentDetail(
		tournamentId: string,
	): Promise<ITournamentDetailResponse> {
		console.log(tournamentId);
		const tournament = await this.prisma.tournament.findUnique({
			where: {
				id: tournamentId,
			},
			select: {
				id: true,
				name: true,
				shortName: true,
				mainColor: true,
				backgroundTournament: true,
				description: true,
				introduction: true,
				checkInBeforeStart: true,
				registrationOpeningDate: true,
				registrationClosingDate: true,
				drawDate: true,
				startDate: true,
				endDate: true,
				organizer: {
					select: {
						id: true,
						name: true,
						avatarURL: true,
						phoneNumber: true,
						email: true,
					},
				},
				contactEmail: true,
				contactPhone: true,
				// numberOfMerchandise: true,
				hasMerchandise: true,
				hasLiveStream: true,
				location: true,
				registrationFeePerPerson: true,
				registrationFeePerPair: true,
				maxEventPerPerson: true,
				prizePool: true,
				requiredAttachment: true,
				protestFeePerTime: true,
				tournamentSerie: {
					select: {
						id: true,
						tournamentSerieName: true,
						serieBackgroundImageURL: true,
					},
				},
				tournamentEvents: {
					select: {
						tournamentEvent: true,
						fromAge: true,
						toAge: true,
						id: true,
					},
				},
				tournamentPosts: true,
			},
		});

		if (tournament === null) return null;

		const groupedEvents: {
			[tournamentEventName: string]: {
				fromAge: number;
				toAge: number;
				id: string;
			}[];
		} = tournament.tournamentEvents.reduce((acc, event) => {
			const { tournamentEvent, ...rest } = event;
			if (!acc[tournamentEvent]) {
				acc[tournamentEvent] = [];
			}
			acc[tournamentEvent].push(rest);
			return acc;
		}, {});

		const tournamentResponse = {
			...tournament,
			hasPost: tournament.tournamentPosts.length > 0,
			liveStreamRooms: [],
			tournamentEvents: groupedEvents,

			expiredTimeLeft:
				tournament === null
					? ""
					: this.calculateTimeDetailLeft(tournament.registrationClosingDate),
		};
		return tournamentResponse;
	}

	async getTournamentPost(tournamentId: string): Promise<TournamentPost[]> {
		try {
			return this.prisma.tournamentPost.findMany({
				where: {
					tournamentId,
				},
			});
		} catch (e) {
			console.error("Get TournamentPost failed", e);
			throw e;
		}
	}

	async getTournamentUmpire(
		tournamentId: string,
	): Promise<TournamentUmpires[]> {
		try {
			return this.prisma.tournamentUmpires.findMany({
				where: {
					tournamentId,
				},

				include: {
					user: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							phoneNumber: true,
							height: true,
							email: true,
							dateOfBirth: true,
						},
					},
				},
			});
		} catch (e) {
			console.error("getTournamentUmpire failed: ", e);
			throw e;
		}
	}

	async getTournamentsByUserId(
		userId: string,
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<ITournamentResponse>> {
		try {
			const page: number =
				parseInt(options.page?.toString()) || DEFAULT_PAGE_NUMBER;
			const perPage: number =
				parseInt(options.perPage?.toString()) || DEFAULT_PAGE_SIZE;
			const skip: number = (page - 1) * perPage;

			const [total, tournaments] = await Promise.all([
				this.prisma.tournament.count({
					where: {
						organizerId: userId,
					},
				}),

				this.prisma.tournament.findMany({
					where: {
						organizerId: userId,
					},
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
							},
						},
						numberOfMerchandise: true,
						hasMerchandise: true,
						location: true,
						registrationFeePerPerson: true,
						registrationFeePerPair: true,
						merchandiseImages: true,
						maxEventPerPerson: true,
						prizePool: true,
						requiredAttachment: true,
						umpirePerMatch: true,
						protestFeePerTime: true,
						tournamentSerie: {
							select: {
								id: true,
								belongsToUser: {
									select: {
										id: true,
										name: true,
										email: true,
										phoneNumber: true,
									},
								},
								tournamentSerieName: true,
								serieBackgroundImageURL: true,
							},
						},
					},
				}),
			]);

			const tournamentsResponse = Object.values(tournaments).map(
				(tournament) => ({
					...tournament,
					expiredTimeLeft: this.calculateTimeLeft(
						tournament.registrationClosingDate,
					),
				}),
			);

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
			console.error("getTournamentsByUserId failed:  ", e);
			throw e;
		}
	}

	async getTournamentsByOrganizerId(
		organizerId: string,
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<ITournamentResponse>> {
		try {
			const page: number =
				parseInt(options.page?.toString()) || DEFAULT_PAGE_NUMBER;
			const perPage: number =
				parseInt(options.perPage?.toString()) || DEFAULT_PAGE_SIZE;
			const skip: number = (page - 1) * perPage;

			const [total, tournaments] = await Promise.all([
				this.prisma.tournament.count({
					where: {
						organizerId: organizerId,
					},
				}),

				this.prisma.tournament.findMany({
					where: {
						organizerId: organizerId,
					},
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
							},
						},
						numberOfMerchandise: true,
						hasMerchandise: true,
						location: true,
						registrationFeePerPerson: true,
						registrationFeePerPair: true,
						merchandiseImages: true,
						maxEventPerPerson: true,
						prizePool: true,
						requiredAttachment: true,
						umpirePerMatch: true,
						protestFeePerTime: true,
						tournamentSerie: {
							select: {
								id: true,
								belongsToUser: {
									select: {
										id: true,
										name: true,
										email: true,
										phoneNumber: true,
									},
								},
								tournamentSerieName: true,
								serieBackgroundImageURL: true,
							},
						},
					},
				}),
			]);

			const tournamentsResponse = Object.values(tournaments).map(
				(tournament) => ({
					...tournament,
					expiredTimeLeft: this.calculateTimeLeft(
						tournament.registrationClosingDate,
					),
				}),
			);

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
			console.error("getTournamentsByUserId failed:  ", e);
			throw e;
		}
	}

	async getFeatureTournaments(): Promise<Tournament[]> {
		try {
			return await this.prisma.tournament.findMany({
				where: {
					status: TournamentStatus.ON_GOING,
				},
				take: 5,
				orderBy: {
					TournamentParticipants: {
						_count: "desc",
					},
				},
			});
		} catch (e) {
			console.error("getFeatureTournament failed: ", e);
			throw e;
		}
	}
}
