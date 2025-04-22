import { Injectable } from "@nestjs/common";
import { PrismaClient, Tournament, TournamentEvent } from "@prisma/client";
import { IParticipantsOfTournamentEvent, ITournamentEventParticipants } from "src/domain/interfaces/tournament/tournament-event/tournament-event.interface";
import { ICreateTournamentEvent } from "src/domain/interfaces/tournament/tournament.interface";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";
import { ITournamentStandingBoardInterface } from "../../domain/interfaces/tournament/tournament-event/tournament-standing-board.interface";

@Injectable()
export class PrismaTournamentEventRepositoryAdapter
	implements TournamentEventRepositoryPort
{
	constructor(private prisma: PrismaClient) {}
	async updateManyTournamentEvent(tournamentEvents: TournamentEvent[]): Promise<TournamentEvent[]> {
		let tournamentEventsUpdated: TournamentEvent[] = [];
		for (const item of tournamentEvents) {
			const updatedTournamentEvent = await this.prisma.tournamentEvent.update({
				where: {
					id: item.id,
				},
				data: {
					...item,
				},
			});
			tournamentEventsUpdated.push(updatedTournamentEvent);
		}
		return tournamentEventsUpdated;
	}
	async getParticipantsByTournamentEvent(tournamentEventId: string): Promise<IParticipantsOfTournamentEvent> {
		const [numberOfParticipants, listParticipants] = await Promise.all([
			await this.prisma.tournamentParticipants.count({
				where: {
					tournamentEventId: tournamentEventId,
				},
			}),
			await this.prisma.tournamentParticipants.findMany({
				where: {
					tournamentEventId: tournamentEventId,
				},
				select: {
					id: true,
					user: {
						select: {
							id: true,
							name: true,
							phoneNumber: true,
							email: true,
							dateOfBirth: true,
							hands: true,
							height: true,
							gender: true,
							avatarURL: true,
						},
					},
					partner: {
						select: {
							id: true,
							name: true,
							email: true,
							phoneNumber: true,
							dateOfBirth: true,
							gender: true,
							hands: true,
							height: true,
							avatarURL: true,
						},
					},
				},
			}),
		]);
		return {
			numberOfParticipants: numberOfParticipants,
			listParticipants: listParticipants,
		};
	}
	async getTournamentOfTournamentEvent(tournamentEventId: string): Promise<Tournament> {
		const tournamentEvent = await this.prisma.tournamentEvent.findUnique({
			where: {
				id: tournamentEventId
			},
			select: {
				tournament: true
			}
		});
		return tournamentEvent.tournament;
	}
	async getTournamentEventById(tournamentEventId: string): Promise<any> {
		return await this.prisma.tournamentEvent.findUnique({
			where: {
				id: tournamentEventId
			},
			include: {
				tournament: true
			}
		});
	}

	async getParticipantsOfTournamentEvent(
		tournamentEventId: string,
	): Promise<ITournamentEventParticipants> {
		// const numberOfParticipants = await this.prisma.tournamentParticipants.count({
		// 	where: {
		// 		tournamentEventId: tournamentEventId
		// 	}
		// });
		const [numberOfParticipants, listParticipants] = await Promise.all([
			await this.prisma.tournamentParticipants.count({
				where: {
					tournamentEventId: tournamentEventId,
				},
			}),
			await this.prisma.tournamentParticipants.findMany({
				where: {
					tournamentEventId: tournamentEventId,
				},
				select: {
					user: {
						select: {
							id: true,
							name: true,
							phoneNumber: true,
							email: true,
							dateOfBirth: true,
							hands: true,
							height: true,
							gender: true,
							avatarURL: true,
						},
					},
					partner: {
						select: {
							id: true,
							name: true,
							email: true,
							phoneNumber: true,
							dateOfBirth: true,
							gender: true,
							hands: true,
							height: true,
							avatarURL: true,
						},
					},
				},
			}),
		]);
		return {
			numberOfParticipants: numberOfParticipants,
			listParticipants: listParticipants,
		};
	}

	async createMultipleTournamentEvent(
		tournamentEvents: ICreateTournamentEvent[],
		tournamentId: string,
	): Promise<any> {
		const events = Object.values(tournamentEvents).map((event) => ({
			...event,
			tournamentId: tournamentId,
		}));
		console.log(events);
		const tournaments: TournamentEvent[] =
			await this.prisma.tournamentEvent.createManyAndReturn({
				data: events,
				skipDuplicates: true,
			});
		return [];
	}

	async getAllTournamentEvent(
		tournamentId: string,
	): Promise<TournamentEvent[]> {
		return await this.prisma.tournamentEvent.findMany({
			where: {
				tournamentId: tournamentId,
			},
		});
	}

	getAllTournamentEventOfUser(
		userId: string,
		tournamentId: string,
	): Promise<TournamentEvent[]> {
		throw new Error("Method not implemented.");
	}

	createNewTournamentEvent(): Promise<any> {
		throw new Error("Method not implemented.");
	}

	async getTournamentEventOfTournament(
		tournamentId: string,
	): Promise<TournamentEvent[]> {
		try {
			return await this.prisma.tournamentEvent.findMany({
				where: {
					tournamentId,
				},
			});
		} catch (e) {
			console.error("getTournamentEventOfTournament faield", e);
			throw e;
		}
	}

	async getTournamentEventStandingBoard(
		tournamentEventId: string,
	): Promise<ITournamentStandingBoardInterface> {
		try {
			return this.prisma.tournamentEvent.findUnique({
				where: {
					id: tournamentEventId,
				},
				select: {
					championship: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true,
								},
							},

							partner: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true,
								},
							},
						},
					},
					runnerUp: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true,
								},
							},

							partner: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true,
								},
							},
						},
					},
					thirdPlace: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true,
								},
							},

							partner: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true,
								},
							},
						},
					},
					jointThirdPlace: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true,
								},
							},

							partner: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true,
								},
							},
						},
					},
				},
			});
		} catch (e) {
			console.error("getTournamentEventStandingBoard failed", e);
			throw e;
		}
	}
}
