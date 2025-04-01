import { Injectable } from "@nestjs/common";
import { Game, Match, MatchStatus, PrismaClient, TournamentEvent } from "@prisma/client";
import { create } from "domain";
import { ICreateMatch, IMatchDetailBracketResponse } from "src/domain/interfaces/tournament/match/match.interface";
import { IMatchQueryResponse } from "src/domain/interfaces/tournament/match/match.query";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";
import { convertToLocalTime } from "../util/convert-to-local-time.util";
import { IGameAfterUpdatePointResponse, IPointOfGameResponse } from "src/domain/interfaces/tournament/match/game.interface";
import { IParticipantResponse } from "src/domain/interfaces/tournament/match/competitor.interface";

@Injectable()
export class PrismaMatchRepositoryAdapter implements MatchRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	) {
	}
	async updatePoint(gameId: string, winningId: string): Promise<IGameAfterUpdatePointResponse> {
		const game = await this.prisma.game.findUnique({
			where: {
				id: gameId
			}
		});

		const match = await this.prisma.match.findUnique({
			where: {
				id: game.matchId
			}
		});
		const tournamentEvent = await this.prisma.tournamentEvent.findUnique({
			where: {
				id: match.tournamentEventId
			}
		});
		// console.log(tournamentEvent);
		const [leftCompetitorPoint, rightCompetitorPoint] = [game.leftCompetitorPoint, game.rightCompetitorPoint];
		if (match.leftCompetitorId === winningId) {
			const point = await this.prisma.game.update({
				where: {
					id: gameId
				},
				data: {
					leftCompetitorPoint: leftCompetitorPoint + 1
				}
			});
			game.leftCompetitorPoint++;
		} else if (match.rightCompetitorId === winningId) {
			const point = await this.prisma.game.update({
				where: {
					id: game.id
				},
				data: {
					rightCompetitorPoint: rightCompetitorPoint + 1
				}
			})
			game.rightCompetitorPoint++;
		}
		if (game.leftCompetitorPoint >= tournamentEvent.winningPoint && 
			(game.leftCompetitorPoint - game.rightCompetitorPoint) >= 2
		) {
			await this.prisma.game.update({
				where: {
					id: game.id
				},
				data: {
					gameWonByCompetitorId: winningId,
					currentServerId: winningId
				}
			});
			const tournamentParticipant: IParticipantResponse = await this.prisma.tournamentParticipants.findUnique({
				where: {
					id: winningId
				},
				select: {
					id: true,
					user: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							height: true,
							hands: true,
						}
					},
					partner: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							hands: true,
							height: true
						}
					}
				}
			});
			const games = await this.prisma.game.findMany({
				where: {
					matchId: game.matchId
				}
			});
			return {
				currentGameNumber: game.gameNumber,
				currentServerId: winningId,
				isEnd: true,
				message: "Game ended!",
				winningCompetitor: {
					id: winningId,
					userName: tournamentParticipant.user.name,
					partnerName: tournamentParticipant.partner.name
				},
				currentPoint: games.map(this.transformGameData)
			}
			// return {

			// }
		} 
		if (game.rightCompetitorPoint >= tournamentEvent.winningPoint && 
			(game.rightCompetitorPoint - game.rightCompetitorPoint) >= 2
		) {
			const tournamentParticipant: IParticipantResponse = await this.prisma.tournamentParticipants.findUnique({
				where: {
					id: winningId
				},
				select: {
					id: true,
					user: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							height: true,
							hands: true,
						}
					},
					partner: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							hands: true,
							height: true
						}
					}
				}
			});
			const games = await this.prisma.game.findMany({
				where: {
					matchId: game.matchId
				}
			});
			return {
				currentGameNumber: game.gameNumber,
				currentServerId: winningId,
				isEnd: true,
				message: "Game ended!",
				winningCompetitor: {
					id: winningId,
					userName: tournamentParticipant.user.name,
					partnerName: tournamentParticipant.partner.name
				},
				currentPoint: games.map(this.transformGameData)
			}
		}

		if (game.leftCompetitorPoint === tournamentEvent.lastPoint) {
			const tournamentParticipant: IParticipantResponse = await this.prisma.tournamentParticipants.findUnique({
				where: {
					id: winningId
				},
				select: {
					id: true,
					user: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							height: true,
							hands: true,
						}
					},
					partner: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							hands: true,
							height: true
						}
					}
				}
			});
			const games = await this.prisma.game.findMany({
				where: {
					matchId: game.matchId
				}
			});
			return {
				currentGameNumber: game.gameNumber,
				currentServerId: winningId,
				isEnd: true,
				message: "Game ended!",
				winningCompetitor: {
					id: winningId,
					userName: tournamentParticipant.user.name,
					partnerName: tournamentParticipant.partner.name
				},
				currentPoint: games.map(this.transformGameData)
			}
		}
		if (game.rightCompetitorPoint === tournamentEvent.lastPoint) {
			const tournamentParticipant: IParticipantResponse = await this.prisma.tournamentParticipants.findUnique({
				where: {
					id: winningId
				},
				select: {
					id: true,
					user: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							height: true,
							hands: true,
						}
					},
					partner: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							hands: true,
							height: true
						}
					}
				}
			});
			const games = await this.prisma.game.findMany({
				where: {
					matchId: game.matchId
				}
			});
			return {
				currentGameNumber: game.gameNumber,
				currentServerId: winningId,
				isEnd: true,
				message: "Game ended!",
				winningCompetitor: {
					id: winningId,
					userName: tournamentParticipant.user.name,
					partnerName: tournamentParticipant.partner.name
				},
				currentPoint: games.map(this.transformGameData)
			}
		}	
		const tournamentParticipant: IParticipantResponse = await this.prisma.tournamentParticipants.findUnique({
			where: {
				id: winningId
			},
			select: {
				id: true,
				user: {
					select: {
						id: true,
						name: true,
						avatarURL: true,
						gender: true,
						height: true,
						hands: true,
					}
				},
				partner: {
					select: {
						id: true,
						name: true,
						avatarURL: true,
						gender: true,
						hands: true,
						height: true
					}
				}
			}
		});
		const games = await this.prisma.game.findMany({
			where: {
				matchId: game.matchId
			}
		});
		return {
			currentGameNumber: game.gameNumber,
			currentServerId: winningId,
			isEnd: false,
			message: "",
			winningCompetitor: null,
			currentPoint: games.map(this.transformGameData)
		}
	}

	transformGameData(game: Game) : IPointOfGameResponse {
		return {
			id: game.id,
			gameNumber: game.gameNumber,
			left: game.leftCompetitorPoint,
			right: game.rightCompetitorPoint
		};
	}
	async updateStartTimeForMatch(matchId: string, currentServerId: string): Promise<Game> {
		const game = await this.prisma.game.create({
			data: {
				leftCompetitorPoint: 0,
				rightCompetitorPoint: 0,
				gameNumber: 1,
				matchId: matchId, 
				currentServerId: currentServerId
			}
		});
		return game;
	}
	async updateForfeitCompetitor(matchId: string, forfeitCompetitorId: string): Promise<any> {
		return await this.prisma.match.update({
			where: {
				id: matchId
			},
			data: {
				forfeitCompetitorId: forfeitCompetitorId
			}
		});
	}
	async updateAttendance(matchId: string, leftCompetitorAttendance: boolean, rightCompetitorAttendance: boolean): Promise<any> {
		return await this.prisma.match.update({ 
			where: {
				id: matchId
			},
			data: {
				leftCompetitorAttendance: leftCompetitorAttendance,
				rightCompetitorAttendance: rightCompetitorAttendance
			}
		});
	}
	async getAllMatchesOfTournamentEvent(tournamentEventId: string): Promise<any[]> {
		const tournamentEvent = await this.prisma.tournamentEvent.findUnique({
			where: {
				id: tournamentEventId
			},
			select: {
				stages: {
					select: {
						matches: {
							select: {
								id: true,
								leftCompetitor: {
									select: {
										id: true,
										user: {
											select: {
												id: true,
												name: true,
												avatarURL: true,
												gender: true,
												height: true,
												hands: true
											}
										},
										partner: {
											select: {
												id: true,
												name: true,
												avatarURL: true,
												gender: true,
												height: true,
												hands: true
											}
										}
									}
								},
								rightCompetitor: {
									select: {
										id: true,
										user: {
											select: {
												id: true,
												name: true,
												avatarURL: true,
												gender: true,
												height: true,
												hands: true
											}
										},
										partner: {
											select: {
												id: true,
												name: true,
												avatarURL: true,
												gender: true,
												height: true,
												hands: true
											}
										}
									}
								},
								matchStatus: true,
								stage: {
									select: {
										stageName: true,
										id: true
									}
								},
								matchNumber: true,
								nextMatchId: true,
								startedWhen: true,
								umpire: {
									select: {
										id: true,
										name: true
									}
								}
							},
							orderBy: {
								matchNumber: "desc"
							}
						}
					}
				}
			}
		});

		// const matches: IMatchQueryResponse[] = tournamentEvent.stages[0].matches;
		let matchesBeforeFormat = [];
		console.log(tournamentEvent);
		tournamentEvent.stages.forEach((item) => {
			matchesBeforeFormat.push(...item.matches);
		});	
		const matches = matchesBeforeFormat.map(this.transformMatchData)
		return matches;
	}

	// transformMatchKeys(match: Match) : IMatchDetailBracketResponse{
  //   return {
  //       ...match,
  //       startTime: match.startedWhen.toISOString(),
  //       tournamentRoundText: match.stageId,
  //       state: match.matchStatus,
	// 			name: match.matchNumber.toString(),
	// 			id: match.id,
	// 			nextMatchId: match.nextMatchId,
	// 		};
	// }

	transformMatchData(match) {
    return {
        id: match.id,
        participants: [
            match.leftCompetitor ? {
                id: match.leftCompetitor.id,
								resultText: "Win",
                player1: {
                    id: match.leftCompetitor.user.id,
                    name: match.leftCompetitor.user.name,
                    gender: match.leftCompetitor.user.gender
                },
                player2: match.leftCompetitor.partner ? {
                    id: match.leftCompetitor.partner.id,
                    name: match.leftCompetitor.partner.name,
                    gender: match.leftCompetitor.partner.gender,
                } : null
            } : null,
            match.rightCompetitor ? {
                id: match.rightCompetitor.id,
								resultText: "Lose",
                player1: {
                    id: match.rightCompetitor.user.id,
                    name: match.rightCompetitor.user.name,
                    gender: match.rightCompetitor.user.gender,
                },
                player2: match.rightCompetitor.partner ? {
                    id: match.rightCompetitor.partner.id,
                    name: match.rightCompetitor.partner.name,
                    gender: match.rightCompetitor.partner.gender,
                } : null
            } : null
        ].filter(Boolean),
        state: match.matchStatus,
        tournamentRoundText: match.stage.stageName,
        name: `Match ${match.matchNumber}`,
        nextMatchId: match.nextMatchId,
        startTime: match.startedWhen || new Date().toISOString()
			};
		}
	async createMultipleMatch(createMatches: ICreateMatch[]): Promise<any> {
		return await this.prisma.match.createManyAndReturn({
			data: createMatches
		});
	}
	async getMatchDetail(matchId: string): Promise<Match> {
		return await this.prisma.match.findUnique({
			where: {
				id: matchId
			}
		});
	}
	createMatch(): Promise<any> {
		throw new Error("Method not implemented.");
	}
	getMatchesOfStage(stageId: string): Promise<Match[]> {
		throw new Error("Method not implemented.");
	}
	updateMatch(): Promise<any> {
		throw new Error("Method not implemented.");
	}

	
}