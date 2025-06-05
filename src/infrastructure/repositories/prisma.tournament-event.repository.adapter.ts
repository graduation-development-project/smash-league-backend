import { create } from 'domain';
import { Injectable } from "@nestjs/common";
import { EventPrize, PrismaClient, PrizeType, Requirement, Tournament, TournamentEvent, TournamentEventStatus } from "@prisma/client";
import {
	IConditionResponse,
	IParticipantsOfTournamentEvent,
	IPrizeResponse,
	ITournamentEventDetailWithPrizeAndConditionResponse,
	ITournamentEventParticipants,
} from "src/domain/interfaces/tournament/tournament-event/tournament-event.interface";
import { ICreateTournamentEvent } from "src/domain/interfaces/tournament/tournament.interface";
import { TournamentEventRepositoryPort } from "src/domain/repositories/tournament-event.repository.port";
import { ITournamentOtherPrizeWinner, ITournamentStandingBoardInterface } from "../../domain/interfaces/tournament/tournament-event/tournament-standing-board.interface";
import { convertStringToEnum } from '../util/enum-convert.util';

@Injectable()
export class PrismaTournamentEventRepositoryAdapter
	implements TournamentEventRepositoryPort
{
	constructor(private prisma: PrismaClient) {}
	async isExistNotOthersPrize(tournamentEventId: string): Promise<EventPrize[]> {
		return await this.prisma.eventPrize.findMany({
			where: {
				tournamentEventId: tournamentEventId,
				prizeType: {
					not: PrizeType.Others
				}
			}
		});
	}
	async getTournamentEventAwardsWithWinner(tournamentEventId: string): Promise<ITournamentOtherPrizeWinner[]> {
		const otherPrizes = await this.prisma.eventPrize.findMany({
			where: {
				tournamentEventId: tournamentEventId,
				prizeType: PrizeType.Others
			},
			select: {
				prizeName: true,
				winningParticipant: {
					select: {
						user: {
							select: {
								id: true,
								name: true,
								gender: true,
								dateOfBirth: true,
								height: true,
								avatarURL: true
							}
						},
						partner: {
							select: {
								id: true,
								name: true,
								gender: true,
								dateOfBirth: true,
								height: true,
								avatarURL: true
							}
						}
					}
				}
			}
		});
		var otherPrizesDto: ITournamentOtherPrizeWinner[] = [];
		for (let i = 0; i < otherPrizes.length; i++) {
			otherPrizesDto.push({
				prizeName: otherPrizes[i].prizeName,
				winner: otherPrizes[i].winningParticipant
			})
		}
		return otherPrizesDto;
	}

	async updateManyTournamentEvent(
		tournamentEvents: TournamentEvent[],
	): Promise<TournamentEvent[]> {
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

	async getParticipantsByTournamentEvent(
		tournamentEventId: string,
	): Promise<IParticipantsOfTournamentEvent> {
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

					fromTeam: true,
				},
			}),
		]);
		return {
			numberOfParticipants: numberOfParticipants,
			listParticipants: listParticipants,
		};
	}

	async getTournamentOfTournamentEvent(
		tournamentEventId: string,
	): Promise<Tournament> {
		const tournamentEvent = await this.prisma.tournamentEvent.findUnique({
			where: {
				id: tournamentEventId,
			},
			select: {
				tournament: true,
			},
		});
		return tournamentEvent.tournament;
	}

	async getTournamentEventById(tournamentEventId: string): Promise<any> {
		return await this.prisma.tournamentEvent.findUnique({
			where: {
				id: tournamentEventId,
			},
			include: {
				tournament: true,
			},
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

	async createMultipleTournamentEvent(
		tournamentEvents: ICreateTournamentEvent[],
		tournamentId: string,
	): Promise<any> {
		const events = Object.values(tournamentEvents).map((event) => ({
			...event,
			tournamentId: tournamentId,
		}));
		events.forEach((item) => {
			delete item.championshipPrize;
			delete item.runnerUpPrize;
			delete item.thirdPlacePrize;
		})
		console.log(events);
		for (let i = 0; i < events.length; i++) {
			const prizesToCreate = events[i].createPrizes.createPrizes;
			const requirementsToAdd = events[i].createTournamentRequirements;
			console.log("requirement to add: ");
			console.log(requirementsToAdd);
			delete events[i].createPrizes;
			delete events[i]?.createTournamentRequirements;
			const eventCreated = await this.prisma.tournamentEvent.create({
				data: events[i]
			});
			const prizes = Object.values(prizesToCreate).map((prize) => ({
				...prize,
				prizeType: convertStringToEnum(PrizeType, prize.prizeName) !== null? 
						convertStringToEnum(PrizeType, prize.prizeName) : PrizeType.Others,
				tournamentEventId: eventCreated.id
			}));
			const requirements = requirementsToAdd.createTournamentRequirements !== undefined? Object.values(requirementsToAdd.createTournamentRequirements).map((item) => ({
				...item,
				tournamentEventId: eventCreated.id
			})) : null;
			console.log(requirements);
			const prizesCreated = await this.prisma.eventPrize.createManyAndReturn({
				data: prizes
			});
			const requirementsCreated = requirements !== null? await this.prisma.requirement.createManyAndReturn({
				data: requirements
			}) : null;
		}
		// const tournaments: TournamentEvent[] =
		// 	await this.prisma.tournamentEvent.createManyAndReturn({
		// 		data: events,
		// 		skipDuplicates: true,
		// 	});
		// for (let i = 0; i < tournaments.length; i++) {

		// }	
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
	): Promise<ITournamentEventDetailWithPrizeAndConditionResponse[]> {
		try {
			var responses: ITournamentEventDetailWithPrizeAndConditionResponse[] = [];
			const tournamentEvents = await this.prisma.tournamentEvent.findMany({
				where: {
					tournamentId: tournamentId
				}
			});
			for (let i = 0; i < tournamentEvents.length; i++) {
				const prizes = await this.prisma.eventPrize.findMany({
					where: {
						tournamentEventId: tournamentEvents[i].id
					}
				});
				const requirements = await this.prisma.requirement.findMany({
					where: {
						tournamentEventId: tournamentEvents[i].id
					}
				});
				const tournamentEvent: ITournamentEventDetailWithPrizeAndConditionResponse = {
					id: tournamentEvents[i].id,
					fromAge: tournamentEvents[i].fromAge,
					toAge: tournamentEvents[i].toAge,
					minimumAthlete: tournamentEvents[i].minimumAthlete,
					maximumAthlete: tournamentEvents[i].maximumAthlete,
					winningPoint: tournamentEvents[i].winningPoint,
					lastPoint: tournamentEvents[i].lastPoint,
					tournamentEvent: tournamentEvents[i].tournamentEvent,
					tournamentEventStatus: tournamentEvents[i].tournamentEventStatus,
					typeOfFormat: tournamentEvents[i].typeOfFormat,

					conditions: await this.formatConditionResponse(requirements),
					prizes: await this.formatPrizeResponse(prizes),
					needToUpdatePrize: await this.checkIsNeedToUpdateOtherPrize(prizes, tournamentEvents[i].tournamentEventStatus)
				};
				responses.push(tournamentEvent);
			}
			return responses;
		} catch (e) {
			console.error("getTournamentEventOfTournament failed", e);
			throw e;
		}
	}

	async checkIsNeedToUpdateOtherPrize(prizes: EventPrize[], 
		tournamentEventStatus: TournamentEventStatus): Promise<boolean> {
		if (prizes.length === 0) return false;
		for (let i = 0; i < prizes.length; i++) {
			console.log(prizes[i].prizeType, " ", prizes[i].winningParticipantId);
			if (prizes[i].prizeType === PrizeType.Others && prizes[i].winningParticipantId === null)
				return true;
		}
		return false;
	}

	async formatPrizeResponse(prizes: EventPrize[]): Promise<IPrizeResponse[]> {
		var prizeResponses: IPrizeResponse[] = [];
		for(let i = 0; i < prizes.length; i++) {
			const prizeResponse: IPrizeResponse = {
				id: prizes[i].id,
				prizeDetail: prizes[i].prize,
				prizeName: prizes[i].prizeName,
				prizeType: prizes[i].prizeType
			};
			prizeResponses.push(prizeResponse);
		}
		return prizeResponses;
	}

	async formatConditionResponse(requirements: Requirement[]): Promise<IConditionResponse[]> {
		var conditionResponses: IConditionResponse[] = [];
		for (let i = 0; i < requirements.length; i++) {
			const conditionResponse: IConditionResponse = {
				id: requirements[i].id,
				conditionName: requirements[i].requirementName,
				conditionDescription: requirements[i].requirementDescription,
				conditionType: requirements[i].requirementType
			};
			conditionResponses.push(conditionResponse);
		}
		return conditionResponses;
	}

	async getTournamentEventStandingBoard(
		tournamentEventId: string,
	): Promise<ITournamentStandingBoardInterface> {
		try {
			const championshipPrize = await this.prisma.eventPrize.findFirst({
				where: {
					tournamentEventId: tournamentEventId,
					prizeType: PrizeType.ChampionshipPrize
				},
				select: {
					winningParticipant: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true
								}
							},
							partner: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true
								}
							}
						}
					}
				}
			});
			const runnerUpPrize = await this.prisma.eventPrize.findFirst({
				where: {
					tournamentEventId: tournamentEventId,
					prizeType: PrizeType.RunnerUpPrize
				},
				select: {
					winningParticipant: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true
								}
							},
							partner: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true
								}
							}
						}
					}
				}
			});
			const thirdPlacePrizes = await this.prisma.eventPrize.findMany({
				where: {
					tournamentEventId: tournamentEventId,
					prizeType: PrizeType.RunnerUpPrize
				},
				select: {
					winningParticipant: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true
								}
							},
							partner: {
								select: {
									id: true,
									name: true,
									gender: true,
									dateOfBirth: true,
									height: true,
									avatarURL: true
								}
							}
						}
					}
				}
			});
			return {
				championship: championshipPrize.winningParticipant,
				runnerUp: runnerUpPrize.winningParticipant,
				thirdPlace: thirdPlacePrizes.map((item) => item.winningParticipant)
			};
		} catch (e) {
			console.error("getTournamentEventStandingBoard failed", e);
			throw e;
		}
	}
}
