import { count } from 'node:console';
import { Injectable } from "@nestjs/common";
import { Game, GameStatus, Match, MatchStatus, PrismaClient, TournamentEvent } from "@prisma/client";
import { create } from "domain";
import { ICreateMatch, IMatchDetailBracketResponse } from "src/domain/interfaces/tournament/match/match.interface";
import { IMatchQueryResponse } from "src/domain/interfaces/tournament/match/match.query";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";
import { convertToLocalTime } from "../util/convert-to-local-time.util";
import { IGameAfterUpdatePointResponse, IPointOfGameResponse } from "src/domain/interfaces/tournament/match/game.interface";
import { IParticipantResponse } from "src/domain/interfaces/tournament/match/competitor.interface";
import { match } from "assert";

@Injectable()
export class PrismaMatchRepositoryAdapter implements MatchRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	) {
	}
	async getMatchDetailById(matchId: string): Promise<IMatchQueryResponse> {
		const matchDetail: any = await this.prisma.match.findUnique({
			where: {
				id: matchId
			},
			select: {
				id: true,
				court: {
					select: {
						id: true,
						courtCode: true,
					}
				},
				isByeMatch: true,
				leftCompetitor: {
					select: {
						id: true,
						user: {
							select: {
								id: true,
								email: true,
								name: true,
								avatarURL: true,
								gender: true
							}
						},
						partner: {
							select: {
								id: true,
								name: true,
								avatarURL: true,
								email: true,
								gender: true
							}
						}
					}
				},
				matchNumber: true,
				rightCompetitor: {
					select: {
						id: true,
						user: {
							select: {
								id: true,
								email: true,
								name: true,
								avatarURL: true,
								gender: true
							}
						},
						partner: {
							select: {
								id: true,
								name: true,
								avatarURL: true,
								email: true,
								gender: true
							}
						}
					}
				},
				stage: {
					select: {
						stageName: true,
						id: true
					}
				},
				startedWhen: true
			}
		});
		return {
			id: matchDetail.id,
			leftCompetitor: {
				id: matchDetail.leftCompetitor.id,
				user: {
					id: matchDetail.leftCompetitor.user.id,
					name: matchDetail.leftCompetitor.user.name,
					gender: matchDetail.leftCompetitor.user.gender,
					avatarURL	: matchDetail.leftCompetitor.user.avatarURL,
					height: null,
					hands: null
				},
				partner: matchDetail.leftCompetitor.partner === null? null: {
					id: matchDetail.leftCompetitor?.partner?.id,
					name: matchDetail.leftCompetitor?.partner?.name,
					gender: matchDetail.leftCompetitor?.partner?.gender,
					avatarURL	: matchDetail.leftCompetitor?.partner?.avatarURL,
					height: null,
					hands: null
				}
			},
			rightCompetitor: {
				id: matchDetail.rightCompetitor.id,
				user: {
					id: matchDetail.rightCompetitor.user.id,
					name: matchDetail.rightCompetitor.user.name,
					gender: matchDetail.rightCompetitor.user.gender,
					avatarURL	: matchDetail.rightCompetitor.user.avatarURL,
					height: null,
					hands: null
				},
				partner: matchDetail.leftCompetitor.partner === null? null: {
					id: matchDetail.leftCompetitor?.partner?.id,
					name: matchDetail.leftCompetitor?.partner?.name,
					gender: matchDetail.leftCompetitor?.partner?.gender,
					avatarURL	: matchDetail.leftCompetitor?.partner?.avatarURL,
					height: null,
					hands: null
				}
			},
			matchNumber: matchDetail.matchNumber,
			stage: {
				id: matchDetail.stage.id,
				stageName: matchDetail.stage.stageName
			},
			startedWhen: matchDetail.startedWhen,
			umpire: null,
			nextMatchId: null
		};
	}
	async assignCourtForMatch(matchId: string, courtId: string): Promise<Match> {
		return await this.prisma.match.update({
			where: {
				id: matchId
			},
			data: {
				courtId: courtId
			}
		});
	}

	async updatePoint(gameId: string, winningId: string): Promise<IGameAfterUpdatePointResponse> {
		const game = await this.prisma.game.findUnique({
			where: {
				id: gameId
			}
		});
		const tournamentParticipantGet = await this.prisma.tournamentParticipants.findUnique({
			where: {
				id: winningId
			}
		});
		console.log(tournamentParticipantGet);

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
					leftCompetitorPoint: game.leftCompetitorPoint + 1
				}
			});
			// console.log(point);
			// game.leftCompetitorPoint++;
		} else if (match.rightCompetitorId === winningId) {
			const point = await this.prisma.game.update({
				where: {
					id: game.id
				},
				data: {
					rightCompetitorPoint: game.rightCompetitorPoint + 1
				}
			});
			// game.rightCompetitorPoint++;
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
					currentServerId: winningId,
					status: GameStatus.ENDED
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
					partnerName: tournamentParticipant?.partner?.name
				},
				currentPoint: games.map(this.transformGameData)
			}
		} 
		if (game.rightCompetitorPoint >= tournamentEvent.winningPoint && 
			(game.rightCompetitorPoint - game.leftCompetitorPoint) >= 2
		) {
			await this.prisma.game.update({
				where: {
					id: game.id
				},
				data: {
					gameWonByCompetitorId: winningId,
					currentServerId: winningId,
					status: GameStatus.ENDED
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
					partnerName: tournamentParticipant?.partner?.name
				},
				currentPoint: games.map(this.transformGameData)
			};
		}

		if (game.leftCompetitorPoint >= tournamentEvent.lastPoint) {
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
			// tournamentEvent
			const games = await this.prisma.game.findMany({
				where: {
					matchId: game.matchId
				}
			});
			//Set game ended
			const gameUpdate = await this.prisma.game.update({
				where: {
					id: gameId
				},
				data: {
					currentServerId: winningId,
					gameWonByCompetitorId: winningId,
					status: GameStatus.ENDED
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
			};
		}
		if (game.rightCompetitorPoint >= tournamentEvent.lastPoint) {
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
		// if (await this.checkIfWonMatch(match.leftCompetitorId, tournamentEvent.numberOfGames)) {

		// } else if (await this.checkIfWonMatch(match.rightCompetitorId, tournamentEvent.numberOfGames)) {

		// }
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

	// async updatePoint(gameId: string, winningId: string): Promise<any> {
	// 	return await this.processUpdatePointForCompetitor(gameId, winningId);
	// }

	// async checkIfWonMatch(competitorId: string, numberOfGamePerMatch: number): Promise<boolean> {
	// 	const games = await this.prisma.game.count({
	// 		where: {
	// 			gameWonByCompetitorId: competitorId
	// 		}
	// 	});
	// 	// console.log(games);
	// 	return;
	// }

	async processUpdatePointForCompetitor(gameId: string, winningId): Promise<Game> {
		// get data of games
		const game = await this.prisma.game.findUnique({
			where: {
				id: gameId
			}
		});
		//Get data for match
		const match = await this.prisma.match.findUnique({
			where: {
				id: game.matchId
			}
		});
		//get data of tournament events
		const tournamentEvent = await this.prisma.tournamentEvent.findUnique({
			where: {
				id: match.tournamentEventId
			}
		});
		if (match.leftCompetitorId === winningId) {
			return await this.prisma.game.update({
				where: {
					id: gameId
				},
				data: {
					leftCompetitorPoint: game.leftCompetitorPoint + 1
				}
			});
		} else {
			return await this.prisma.game.update({
				where: {
					id: gameId
				},
				data: {
					rightCompetitorPoint: game.rightCompetitorPoint + 1
				}
			});
		}
		const [isWonGame, gameWon] = await this.checkWonGame(game, match, winningId, tournamentEvent.numberOfGames, 
			tournamentEvent.winningPoint, tournamentEvent.lastPoint
		);
		console.log(gameWon);
	}

	async checkWonGame(game: Game, match: Match, winningId: string, 
		numberOfGames: number, winningPoint: number, lastPoint: number): Promise<[boolean, Game | null]> { 
		if (game.leftCompetitorPoint >= winningPoint || game.rightCompetitorPoint >= winningPoint
		) {
			if (Math.abs(game.leftCompetitorPoint - game.rightCompetitorPoint) >= 2) {
				await this.updateGameResult(winningId, game, match, numberOfGames);
			} else if (game.leftCompetitorPoint === lastPoint || game.rightCompetitorPoint === lastPoint) {
				
			}
		}
		return;
	}

	async updateGameResult(winningId: string, game: Game, match: Match, numberOfGames: number): Promise<Game> {
		const gameUpdated = await this.prisma.game.update({
			where: {
				id: game.id
			},
			data: {
				currentServerId: winningId,
				gameWonByCompetitorId: winningId,
				status: GameStatus.ENDED
			}
		});
		const countGames = await this.prisma.game.count({
			where: {
				matchId: match.id,
				gameWonByCompetitorId: winningId
			}
		});
		const updatedMatch = await this.processWonMatch(game, match, winningId, numberOfGames);
		return;
	}

	async processWonMatch(game: Game, match: Match, winningId: string, numberOfGames: number): Promise<any> {
		const games = await this.prisma.game.count({
			where: {
				matchId: game.matchId,
				gameWonByCompetitorId: winningId
			}
		});
		if (Math.floor(numberOfGames / 2) + 1 === games) {
			const matchUpdated = await this.prisma.match.update({
				where: {
					id: match.id
				},
				data: {
					matchWonByCompetitorId: winningId, 
					matchStatus: MatchStatus.ENDED,
				}
			});
		} 
		return;
	}

	async assignCompetitorForNextMatch(competitorId: string, nextMatchId: string): Promise<Match> {
		return;
	}

	async updatePointForLeftCompetitorInGame(gameId: string, leftCompetitorId: string): Promise<any> {
		const tournamentParticipants = await this.prisma.tournamentParticipants.findUnique({
			where: {
				id: leftCompetitorId
			}
		});

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
				currentServerId: currentServerId,
			}
		});
		const matchUpdated = await this.prisma.match.update({
			where: {
				id: matchId
			},
			data: {
				startedWhen: convertToLocalTime(new Date()),
				matchStatus: MatchStatus.ON_GOING
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
		console.log(leftCompetitorAttendance, ' ', rightCompetitorAttendance);
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
		// console.log(tournamentEvent);
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