import { Injectable } from "@nestjs/common";
import { PrismaClient, Tournament, TournamentEvent } from "@prisma/client";
import { ITournamentEventParticipants } from "src/domain/interfaces/tournament/tournament-event/tournament-event.interface";
import { ICreateTournamentEvent } from "src/domain/interfaces/tournament/tournament.interface";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";

@Injectable()
export class PrismaTournamentEventRepositoryAdapter implements TournamentEventRepositoryPort {
	constructor(
		private prisma: PrismaClient
	){
	}
	async getParticipantsOfTournamentEvent(tournamentEventId: string): Promise<ITournamentEventParticipants> {
		// const numberOfParticipants = await this.prisma.tournamentParticipants.count({
		// 	where: {
		// 		tournamentEventId: tournamentEventId
		// 	}
		// });
		const [numberOfParticipants, listParticipants] = await Promise.all([
			await this.prisma.tournamentParticipants.count({
				where: {
					tournamentEventId: tournamentEventId
				}
			}),
			await this.prisma.tournamentParticipants.findMany({
				where: {
					tournamentEventId: tournamentEventId
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
						}
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
						}
					}
				}
			})
		]);
		return {
			numberOfParticipants: numberOfParticipants,
			listParticipants: listParticipants
		};
	}
	async createMultipleTournamentEvent(tournamentEvents: ICreateTournamentEvent[],
																			tournamentId: string
	): Promise<any> {
		const events = Object.values(tournamentEvents).map((event) => ({
			...event,
			tournamentId: tournamentId
		}));
		console.log(events);
		const tournaments: TournamentEvent[] = await this.prisma.tournamentEvent.createManyAndReturn({
			data: events,
			skipDuplicates: true
		})
		return [];
	}

	async getAllTournamentEvent(tournamentId: string): Promise<TournamentEvent[]> {
		return await this.prisma.tournamentEvent.findMany({
			where: {
				tournamentId: tournamentId
			}
		});
	}
	getAllTournamentEventOfUser(userId: string, tournamentId: string): Promise<TournamentEvent[]> {
		throw new Error("Method not implemented.");
	}
	createNewTournamentEvent(): Promise<any> {
		throw new Error("Method not implemented.");
	}
	
}