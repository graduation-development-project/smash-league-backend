import { BadRequestException, Injectable } from "@nestjs/common";
import {
	BadmintonParticipantType,
	Game,
	GameStatus,
	Match,
	MatchStatus,
	Prisma,
	PrismaClient,
	Tournament,
	TournamentEvent,
	TournamentEventStatus,
	TournamentStatus,
} from "@prisma/client";
import { ICreateMatch } from "src/domain/interfaces/tournament/match/match.interface";
import { IMatchQueryResponse } from "src/domain/interfaces/tournament/match/match.query";
import { MatchRepositoryPort } from "src/domain/repositories/match.repository.port";
import { convertToLocalTime } from "../util/convert-to-local-time.util";
import {
	IGameAfterUpdatePointResponse,
	IPointOfGameResponse,
	IWonCompetitorResponse,
} from "src/domain/interfaces/tournament/match/game.interface";
import { IParticipantResponse } from "src/domain/interfaces/tournament/match/competitor.interface";
import { StageOfMatch } from "../enums/tournament/tournament-match.enum";
import { UpdateMatchDTO } from "../../domain/dtos/match/update-match.dto";

@Injectable()
export class PrismaMatchRepositoryAdapter implements MatchRepositoryPort {
	constructor(private readonly prisma: PrismaClient) {}

	async undoUpdatePoint(gameId: string): Promise<Game> {
		return;
	}

	async continueMatch(matchId: string): Promise<Match> {
		return await this.prisma.match.update({
			where: {
				id: matchId,
			},
			data: {
				matchStatus: MatchStatus.ON_GOING,
			},
		});
	}

	async countMatchesOfLastStage(matchId: string): Promise<number> {
		const match = await this.prisma.match.findUnique({
			where: {
				id: matchId,
			},
		});
		return (
			(await this.prisma.match.count({
				where: {
					tournamentEventId: match.tournamentEventId,
				},
			})) + 1
		);
	}

	async assignAthleteIntoMatch(
		matchId: string,
		leftCompetitorId: string,
		rightCompetitorId: string,
	): Promise<Match> {
		return await this.prisma.match.update({
			where: {
				id: matchId,
			},
			data: {
				leftCompetitorId: leftCompetitorId,
				rightCompetitorId: rightCompetitorId,
			},
		});
	}

	async getMatchDetailById(matchId: string): Promise<IMatchQueryResponse> {
		const matchDetail: any = await this.prisma.match.findUnique({
			where: {
				id: matchId,
			},
			select: {
				id: true,
				court: {
					select: {
						id: true,
						courtCode: true,
					},
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
								gender: true,
							},
						},
						partner: {
							select: {
								id: true,
								name: true,
								avatarURL: true,
								email: true,
								gender: true,
							},
						},
					},
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
								gender: true,
							},
						},
						partner: {
							select: {
								id: true,
								name: true,
								avatarURL: true,
								email: true,
								gender: true,
							},
						},
					},
				},
				stage: {
					select: {
						stageName: true,
						id: true,
					},
				},
				startedWhen: true,
			},
		});
		return {
			id: matchDetail.id,
			leftCompetitor: {
				id: matchDetail.leftCompetitor.id,
				user: {
					id: matchDetail.leftCompetitor.user.id,
					name: matchDetail.leftCompetitor.user.name,
					gender: matchDetail.leftCompetitor.user.gender,
					avatarURL: matchDetail.leftCompetitor.user.avatarURL,
					height: null,
					hands: null,
				},
				partner:
					matchDetail.leftCompetitor.partner === null
						? null
						: {
								id: matchDetail.leftCompetitor?.partner?.id,
								name: matchDetail.leftCompetitor?.partner?.name,
								gender: matchDetail.leftCompetitor?.partner?.gender,
								avatarURL: matchDetail.leftCompetitor?.partner?.avatarURL,
								height: null,
								hands: null,
							},
			},
			rightCompetitor: {
				id: matchDetail.rightCompetitor.id,
				user: {
					id: matchDetail.rightCompetitor.user.id,
					name: matchDetail.rightCompetitor.user.name,
					gender: matchDetail.rightCompetitor.user.gender,
					avatarURL: matchDetail.rightCompetitor.user.avatarURL,
					height: null,
					hands: null,
				},
				partner:
					matchDetail.rightCompetitor.partner === null
						? null
						: {
								id: matchDetail.rightCompetitor?.partner?.id,
								name: matchDetail.rightCompetitor?.partner?.name,
								gender: matchDetail.rightCompetitor?.partner?.gender,
								avatarURL: matchDetail.rightCompetitor?.partner?.avatarURL,
								height: null,
								hands: null,
							},
			},
			matchNumber: matchDetail.matchNumber,
			stage: {
				id: matchDetail.stage.id,
				stageName: matchDetail.stage.stageName,
			},
			startedWhen: matchDetail.startedWhen,
			umpire: null,
			nextMatchId: null,
		};
	}

	async assignCourtForMatch(matchId: string, courtId: string): Promise<Match> {
		return await this.prisma.match.update({
			where: {
				id: matchId,
			},
			data: {
				courtId: courtId,
			},
		});
	}

	// async updatePoint(gameId: string, winningId: string): Promise<IGameAfterUpdatePointResponse> {
	// 	const game = await this.prisma.game.findUnique({
	// 		where: {
	// 			id: gameId
	// 		}
	// 	});
	// 	const tournamentParticipantGet = await this.prisma.tournamentParticipants.findUnique({
	// 		where: {
	// 			id: winningId
	// 		}
	// 	});
	// 	console.log(tournamentParticipantGet);

	// 	const match = await this.prisma.match.findUnique({
	// 		where: {
	// 			id: game.matchId
	// 		}
	// 	});
	// 	const tournamentEvent = await this.prisma.tournamentEvent.findUnique({
	// 		where: {
	// 			id: match.tournamentEventId
	// 		}
	// 	});
	// 	// console.log(tournamentEvent);
	// 	const [leftCompetitorPoint, rightCompetitorPoint] = [game.leftCompetitorPoint, game.rightCompetitorPoint];
	// 	if (match.leftCompetitorId === winningId) {
	// 		const point = await this.prisma.game.update({
	// 			where: {
	// 				id: gameId
	// 			},
	// 			data: {
	// 				leftCompetitorPoint: game.leftCompetitorPoint + 1
	// 			}
	// 		});
	// 		// console.log(point);
	// 		// game.leftCompetitorPoint++;
	// 	} else if (match.rightCompetitorId === winningId) {
	// 		const point = await this.prisma.game.update({
	// 			where: {
	// 				id: game.id
	// 			},
	// 			data: {
	// 				rightCompetitorPoint: game.rightCompetitorPoint + 1
	// 			}
	// 		});
	// 		// game.rightCompetitorPoint++;
	// 	}
	// 	if (game.leftCompetitorPoint >= tournamentEvent.winningPoint &&
	// 		(game.leftCompetitorPoint - game.rightCompetitorPoint) >= 2
	// 	) {
	// 		await this.prisma.game.update({
	// 			where: {
	// 				id: game.id
	// 			},
	// 			data: {
	// 				gameWonByCompetitorId: winningId,
	// 				currentServerId: winningId,
	// 				status: GameStatus.ENDED
	// 			}
	// 		});
	// 		const tournamentParticipant: IParticipantResponse = await this.prisma.tournamentParticipants.findUnique({
	// 			where: {
	// 				id: winningId
	// 			},
	// 			select: {
	// 				id: true,
	// 				user: {
	// 					select: {
	// 						id: true,
	// 						name: true,
	// 						avatarURL: true,
	// 						gender: true,
	// 						height: true,
	// 						hands: true,
	// 					}
	// 				},
	// 				partner: {
	// 					select: {
	// 						id: true,
	// 						name: true,
	// 						avatarURL: true,
	// 						gender: true,
	// 						hands: true,
	// 						height: true
	// 					}
	// 				}
	// 			}
	// 		});
	// 		const games = await this.prisma.game.findMany({
	// 			where: {
	// 				matchId: game.matchId
	// 			}
	// 		});
	// 		return {
	// 			currentGameNumber: game.gameNumber,
	// 			currentServerId: winningId,
	// 			isEnd: true,
	// 			message: "Game ended!",
	// 			winningCompetitor: {
	// 				id: winningId,
	// 				userName: tournamentParticipant.user.name,
	// 				partnerName: tournamentParticipant?.partner?.name
	// 			},
	// 			currentPoint: games.map(this.transformGameData)
	// 		}
	// 	}
	// 	if (game.rightCompetitorPoint >= tournamentEvent.winningPoint &&
	// 		(game.rightCompetitorPoint - game.leftCompetitorPoint) >= 2
	// 	) {
	// 		await this.prisma.game.update({
	// 			where: {
	// 				id: game.id
	// 			},
	// 			data: {
	// 				gameWonByCompetitorId: winningId,
	// 				currentServerId: winningId,
	// 				status: GameStatus.ENDED
	// 			}
	// 		});
	// 		const tournamentParticipant: IParticipantResponse = await this.prisma.tournamentParticipants.findUnique({
	// 			where: {
	// 				id: winningId
	// 			},
	// 			select: {
	// 				id: true,
	// 				user: {
	// 					select: {
	// 						id: true,
	// 						name: true,
	// 						avatarURL: true,
	// 						gender: true,
	// 						height: true,
	// 						hands: true,
	// 					}
	// 				},
	// 				partner: {
	// 					select: {
	// 						id: true,
	// 						name: true,
	// 						avatarURL: true,
	// 						gender: true,
	// 						hands: true,
	// 						height: true
	// 					}
	// 				}
	// 			}
	// 		});
	// 		const games = await this.prisma.game.findMany({
	// 			where: {
	// 				matchId: game.matchId
	// 			}
	// 		});
	// 		return {
	// 			currentGameNumber: game.gameNumber,
	// 			currentServerId: winningId,
	// 			isEnd: true,
	// 			message: "Game ended!",
	// 			winningCompetitor: {
	// 				id: winningId,
	// 				userName: tournamentParticipant.user.name,
	// 				partnerName: tournamentParticipant?.partner?.name
	// 			},
	// 			currentPoint: games.map(this.transformGameData)
	// 		};
	// 	}

	// 	if (game.leftCompetitorPoint >= tournamentEvent.lastPoint) {
	// 		const tournamentParticipant: IParticipantResponse = await this.prisma.tournamentParticipants.findUnique({
	// 			where: {
	// 				id: winningId
	// 			},
	// 			select: {
	// 				id: true,
	// 				user: {
	// 					select: {
	// 						id: true,
	// 						name: true,
	// 						avatarURL: true,
	// 						gender: true,
	// 						height: true,
	// 						hands: true,
	// 					}
	// 				},
	// 				partner: {
	// 					select: {
	// 						id: true,
	// 						name: true,
	// 						avatarURL: true,
	// 						gender: true,
	// 						hands: true,
	// 						height: true
	// 					}
	// 				}
	// 			}
	// 		});
	// 		// tournamentEvent
	// 		const games = await this.prisma.game.findMany({
	// 			where: {
	// 				matchId: game.matchId
	// 			}
	// 		});
	// 		//Set game ended
	// 		const gameUpdate = await this.prisma.game.update({
	// 			where: {
	// 				id: gameId
	// 			},
	// 			data: {
	// 				currentServerId: winningId,
	// 				gameWonByCompetitorId: winningId,
	// 				status: GameStatus.ENDED
	// 			}
	// 		});
	// 		return {
	// 			currentGameNumber: game.gameNumber,
	// 			currentServerId: winningId,
	// 			isEnd: true,
	// 			message: "Game ended!",
	// 			winningCompetitor: {
	// 				id: winningId,
	// 				userName: tournamentParticipant.user.name,
	// 				partnerName: tournamentParticipant.partner.name
	// 			},
	// 			currentPoint: games.map(this.transformGameData)
	// 		};
	// 	}
	// 	if (game.rightCompetitorPoint >= tournamentEvent.lastPoint) {
	// 		const tournamentParticipant: IParticipantResponse = await this.prisma.tournamentParticipants.findUnique({
	// 			where: {
	// 				id: winningId
	// 			},
	// 			select: {
	// 				id: true,
	// 				user: {
	// 					select: {
	// 						id: true,
	// 						name: true,
	// 						avatarURL: true,
	// 						gender: true,
	// 						height: true,
	// 						hands: true,
	// 					}
	// 				},
	// 				partner: {
	// 					select: {
	// 						id: true,
	// 						name: true,
	// 						avatarURL: true,
	// 						gender: true,
	// 						hands: true,
	// 						height: true
	// 					}
	// 				}
	// 			}
	// 		});
	// 		const games = await this.prisma.game.findMany({
	// 			where: {
	// 				matchId: game.matchId
	// 			}
	// 		});
	// 		return {
	// 			currentGameNumber: game.gameNumber,
	// 			currentServerId: winningId,
	// 			isEnd: true,
	// 			message: "Game ended!",
	// 			winningCompetitor: {
	// 				id: winningId,
	// 				userName: tournamentParticipant.user.name,
	// 				partnerName: tournamentParticipant.partner.name
	// 			},
	// 			currentPoint: games.map(this.transformGameData)
	// 		}
	// 	}
	// 	// if (await this.checkIfWonMatch(match.leftCompetitorId, tournamentEvent.numberOfGames)) {

	// 	// } else if (await this.checkIfWonMatch(match.rightCompetitorId, tournamentEvent.numberOfGames)) {

	// 	// }
	// 	const tournamentParticipant: IParticipantResponse = await this.prisma.tournamentParticipants.findUnique({
	// 		where: {
	// 			id: winningId
	// 		},
	// 		select: {
	// 			id: true,
	// 			user: {
	// 				select: {
	// 					id: true,
	// 					name: true,
	// 					avatarURL: true,
	// 					gender: true,
	// 					height: true,
	// 					hands: true,
	// 				}
	// 			},
	// 			partner: {
	// 				select: {
	// 					id: true,
	// 					name: true,
	// 					avatarURL: true,
	// 					gender: true,
	// 					hands: true,
	// 					height: true
	// 				}
	// 			}
	// 		}
	// 	});
	// 	const games = await this.prisma.game.findMany({
	// 		where: {
	// 			matchId: game.matchId
	// 		}
	// 	});
	// 	return {
	// 		currentGameNumber: game.gameNumber,
	// 		currentServerId: winningId,
	// 		isEnd: false,
	// 		message: "",
	// 		winningCompetitor: null,
	// 		currentPoint: games.map(this.transformGameData)
	// 	}
	// }

	async updatePoint(
		gameId: string,
		winningId: string,
	): Promise<IGameAfterUpdatePointResponse> {
		return await this.processUpdatePointForCompetitor(gameId, winningId);
	}

	// async checkIfWonMatch(competitorId: string, numberOfGamePerMatch: number): Promise<boolean> {
	// 	const games = await this.prisma.game.count({
	// 		where: {
	// 			gameWonByCompetitorId: competitorId
	// 		}
	// 	});
	// 	// console.log(games);
	// 	return;
	// }

	async processUpdatePointForCompetitor(
		gameId: string,
		winningId,
	): Promise<IGameAfterUpdatePointResponse> {
		// get data of games
		const game = await this.prisma.game.findUnique({
			where: {
				id: gameId,
			},
		});
		//Get data for match
		const match = await this.prisma.match.findUnique({
			where: {
				id: game.matchId,
			},
		});
		//get data of tournament events
		const tournamentEvent = await this.prisma.tournamentEvent.findUnique({
			where: {
				id: match.tournamentEventId,
			},
		});
		const updatedPoint = await this.updatePointForMatch(
			game,
			winningId,
			tournamentEvent,
		);
		return updatedPoint;
	}

	async updatePointForMatch(
		game: Game,
		winningId: string,
		tournamentEvent: TournamentEvent,
	): Promise<IGameAfterUpdatePointResponse> {
		const match = await this.prisma.match.findUnique({
			where: {
				id: game.matchId,
			},
		});
		const [leftCompetitorPoint, rightCompetitorPoint] = [
			game.leftCompetitorPoint,
			game.rightCompetitorPoint,
		];
		let pointUpdated: Game;
		if (match.leftCompetitorId === winningId) {
			pointUpdated = await this.prisma.game.update({
				where: {
					id: game.id,
				},
				data: {
					currentServerId: winningId,
					lastServerId: game.currentServerId,
					leftCompetitorPoint: leftCompetitorPoint + 1,
				},
			});
		} else {
			pointUpdated = await this.prisma.game.update({
				where: {
					id: game.id,
				},
				data: {
					currentServerId: winningId,
					lastServerId: game.currentServerId,
					rightCompetitorPoint: rightCompetitorPoint + 1,
				},
			});
		}
		if (
			pointUpdated.leftCompetitorPoint < tournamentEvent.winningPoint - 1 &&
			pointUpdated.rightCompetitorPoint < tournamentEvent.winningPoint - 1
		) {
			return {
				currentGameNumber: pointUpdated.gameNumber,
				message: "Game continues!",
				currentServerId: winningId,
				isGamePoint: false,
				isEnd: false,
				currentPoint: await this.getAllGamesOfMatch(pointUpdated.matchId),
			};
		}
		return await this.processWonGame(pointUpdated, winningId, tournamentEvent);
	}

	async getAllGamesOfMatch(matchId: string): Promise<IPointOfGameResponse[]> {
		const games = await this.prisma.game.findMany({
			where: {
				matchId: matchId,
			},
			orderBy: {
				gameNumber: "asc",
			},
		});
		return games.map(this.transformGameData);
	}

	// async checkWonGame(game: Game, match: Match, winningId: string,
	// 	numberOfGames: number, winningPoint: number, lastPoint: number): Promise<[boolean, Game | null]> {
	// 	if (game.leftCompetitorPoint >= winningPoint || game.rightCompetitorPoint >= winningPoint
	// 	) {
	// 		if (Math.abs(game.leftCompetitorPoint - game.rightCompetitorPoint) >= 2) {
	// 			await this.updateGameResult(winningId, game, match, numberOfGames);
	// 		} else if (game.leftCompetitorPoint === lastPoint || game.rightCompetitorPoint === lastPoint) {

	// 		}
	// 	}
	// 	return;
	// }

	// async updateGameResult(winningId: string, game: Game, match: Match, numberOfGames: number): Promise<Game> {
	// 	const gameUpdated = await this.prisma.game.update({
	// 		where: {
	// 			id: game.id
	// 		},
	// 		data: {
	// 			currentServerId: winningId,
	// 			gameWonByCompetitorId: winningId,
	// 			status: GameStatus.ENDED
	// 		}
	// 	});
	// 	const countGames = await this.prisma.game.count({
	// 		where: {
	// 			matchId: match.id,
	// 			gameWonByCompetitorId: winningId
	// 		}
	// 	});
	// 	const updatedMatch = await this.processWonMatch(game, match, winningId, numberOfGames);
	// 	return;
	// }

	async processWonGame(
		game: Game,
		winningId: string,
		tournamentEvent: TournamentEvent,
	): Promise<IGameAfterUpdatePointResponse> {
		const match = await this.prisma.match.findUnique({
			where: {
				id: game.matchId,
			},
		});
		if (
			game.leftCompetitorPoint >= tournamentEvent.winningPoint ||
			game.rightCompetitorPoint >= tournamentEvent.winningPoint
		) {
			if (Math.abs(game.leftCompetitorPoint - game.rightCompetitorPoint) >= 2) {
				const gameEnded = await this.prisma.game.update({
					where: {
						id: game.id,
					},
					data: {
						currentServerId: winningId,
						gameWonByCompetitorId: winningId,
						status: GameStatus.ENDED,
					},
				});
				return await this.processWonMatch(
					game,
					match,
					winningId,
					tournamentEvent,
				);
			} else if (
				game.leftCompetitorPoint === tournamentEvent.lastPoint ||
				game.rightCompetitorPoint === tournamentEvent.lastPoint
			) {
				const gameEnded = await this.prisma.game.update({
					where: {
						id: game.id,
					},
					data: {
						currentServerId: winningId,
						gameWonByCompetitorId: winningId,
						status: GameStatus.ENDED,
					},
				});
				return await this.processWonMatch(
					game,
					match,
					winningId,
					tournamentEvent,
				);
			} else if (
				Math.abs(game.leftCompetitorPoint - game.rightCompetitorPoint) === 1
			) {
				if (match.leftCompetitorId === winningId) {
					return {
						currentGameNumber: game.gameNumber,
						message: "Game continues!",
						currentServerId: winningId,
						isGamePoint: true,
						isEnd: false,
						currentPoint: await this.getAllGamesOfMatch(game.matchId),
					};
				} else {
					return {
						currentGameNumber: game.gameNumber,
						message: "Game continues!",
						currentServerId: winningId,
						isGamePoint: true,
						isEnd: false,
						currentPoint: await this.getAllGamesOfMatch(game.matchId),
					};
				}
			} else if (game.leftCompetitorPoint - game.rightCompetitorPoint < 1) {
				if (match.leftCompetitorId === winningId) {
					return {
						currentGameNumber: game.gameNumber,
						message: "Game continues!",
						currentServerId: winningId,
						isGamePoint: false,
						isEnd: false,
						currentPoint: await this.getAllGamesOfMatch(game.matchId),
					};
				} else {
					return {
						currentGameNumber: game.gameNumber,
						message: "Game continues!",
						currentServerId: winningId,
						isGamePoint: false,
						isEnd: false,
						currentPoint: await this.getAllGamesOfMatch(game.matchId),
					};
				}
			}
		} else if (
			(game.leftCompetitorPoint === tournamentEvent.winningPoint - 1 &&
				game.leftCompetitorPoint > game.rightCompetitorPoint) ||
			(game.rightCompetitorPoint === tournamentEvent.winningPoint - 1 &&
				game.rightCompetitorPoint > game.leftCompetitorPoint)
		) {
			return {
				currentGameNumber: game.gameNumber,
				message: "Game continues!",
				currentServerId: winningId,
				isGamePoint: true,
				isEnd: false,
				currentPoint: await this.getAllGamesOfMatch(game.matchId),
			};
		}
	}

	async getWinningCompetitor(
		winningId: string,
	): Promise<IWonCompetitorResponse> {
		const tournamentParticipant: IParticipantResponse =
			await this.prisma.tournamentParticipants.findUnique({
				where: {
					id: winningId,
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
						},
					},
					partner: {
						select: {
							id: true,
							name: true,
							avatarURL: true,
							gender: true,
							hands: true,
							height: true,
						},
					},
				},
			});

		return {
			id: winningId,
			userName: tournamentParticipant.user.name,
			partnerName:
				tournamentParticipant.partner === null
					? null
					: tournamentParticipant.partner.name,
		};
	}

	async getNumberOfMatchOfStage(stageId: string): Promise<number> {
		return await this.prisma.match.count({
			where: {
				stageId: stageId,
			},
		});
	}

	async getThirdPlaceMatch(tournamentEventId: string): Promise<Match | null> {
		const thirdPlaceStage = await this.prisma.stage.findFirst({
			where: {
				tournamentEventId: tournamentEventId,
				stageName: StageOfMatch.ThirdPlaceMatch,
			},
		});
		return await this.prisma.match.findFirst({
			where: {
				stageId: thirdPlaceStage.id,
			},
		});
	}

	async processWonMatch(
		game: Game,
		match: Match,
		winningId: string,
		tournamentEvent: TournamentEvent,
	): Promise<IGameAfterUpdatePointResponse> {
		const games = await this.prisma.game.count({
			where: {
				matchId: game.matchId,
				gameWonByCompetitorId: winningId,
			},
		});
		if (Math.floor(tournamentEvent.numberOfGames / 2) + 1 === games) {
			const matchUpdated = await this.prisma.match.update({
				where: {
					id: match.id,
				},
				data: {
					matchWonByCompetitorId: winningId,
					matchStatus: MatchStatus.ENDED,
				},
			});
			const umpireOfMatch = await this.prisma.tournamentUmpires.findFirst({
				where: {
					tournamentId: tournamentEvent.tournamentId,
					userId: matchUpdated.umpireId,
				},
			});
			const updateUmpireAvailable = await this.prisma.tournamentUmpires.update({
				where: {
					id: umpireOfMatch.id,
				},
				data: {
					isAvailable: true,
				},
			});
			const updateCourtAvailable = await this.prisma.court.update({
				where: {
					id: match.courtId,
				},
				data: {
					courtAvailable: true,
				},
			});
			const matchStage = await this.prisma.stage.findUnique({
				where: {
					id: matchUpdated.stageId,
				},
			});
			if (
				matchUpdated.nextMatchId === null &&
				matchStage.stageName === StageOfMatch.Final
			) {
				await this.updateStandingOfTournamentEvent(matchUpdated.id);
				const checkThirdPlaceMatchExistedOrEnded =
					await this.checkThirdPlaceMatchExistOrEnded(tournamentEvent);
				if (checkThirdPlaceMatchExistedOrEnded) {
					const tournamentEventUpdated =
						await this.prisma.tournamentEvent.update({
							where: {
								id: matchUpdated.tournamentEventId,
							},
							data: {
								tournamentEventStatus: TournamentEventStatus.ENDED,
							},
						});
					await this.processTournamentFinished(tournamentEvent.tournamentId);
					return {
						currentGameNumber: 0,
						currentPoint: await this.getAllGamesOfMatch(match.id),
						currentServerId: winningId,
						isGamePoint: false,
						isEnd: true,
						message: "Final ended!",
						newGame: null,
						winningCompetitor: await this.getWinningCompetitor(winningId),
					};
				}
			} else if (
				matchUpdated.nextMatchId === null &&
				matchStage.stageName === StageOfMatch.ThirdPlaceMatch
			) {
				const checkFinalMatchExistOrEnded =
					await this.checkFinalMatchExistOrEnded(tournamentEvent);
				if (checkFinalMatchExistOrEnded) {
					const tournamentEventUpdated =
						await this.prisma.tournamentEvent.update({
							where: {
								id: matchUpdated.tournamentEventId,
							},
							data: {
								tournamentEventStatus: TournamentEventStatus.ENDED,
							},
						});
					await this.processTournamentFinished(tournamentEvent.tournamentId);
					return {
						currentGameNumber: 0,
						currentPoint: await this.getAllGamesOfMatch(match.id),
						currentServerId: winningId,
						isGamePoint: false,
						isEnd: true,
						message: "Third place match ended!",
						newGame: null,
						winningCompetitor: await this.getWinningCompetitor(winningId),
					};
				}
			} else if (matchStage.stageName === StageOfMatch.Semi_Final) {
				const loseCompetitorId =
					matchUpdated.leftCompetitorId === winningId
						? matchUpdated.rightCompetitorId
						: matchUpdated.leftCompetitorId;
				const processThirdPlaceMatch = await this.processSemiFinalMatch(
					matchUpdated,
					loseCompetitorId,
				);
			} else
				await this.assignCompetitorForNextMatch(
					winningId,
					match.nextMatchId,
					match.id,
				);
			console.log("Won matches!");
			return {
				currentGameNumber: 0,
				currentPoint: await this.getAllGamesOfMatch(match.id),
				currentServerId: winningId,
				isGamePoint: false,
				isEnd: true,
				message: "Match ended!",
				newGame: null,
				winningCompetitor: await this.getWinningCompetitor(winningId),
			};
		} else {
			const newGame = await this.prisma.game.create({
				data: {
					gameNumber: game.gameNumber + 1,
					leftCompetitorPoint: 0,
					rightCompetitorPoint: 0,
					currentServerId: winningId,
					matchId: match.id,
					status: GameStatus.ON_GOING,
					timeStart: new Date(),
				},
			});
			return {
				currentGameNumber: newGame.gameNumber,
				currentPoint: await this.getAllGamesOfMatch(newGame.matchId),
				currentServerId: winningId,
				isGamePoint: false,
				isEnd: true,
				message: "New game!",
				newGame: newGame,
				winningCompetitor: await this.getWinningCompetitor(winningId),
			};
		}
	}

	async processTournamentFinished(tournamentId: string): Promise<any> {
		const tournamentEvents = await this.prisma.tournamentEvent.findMany({
			where: {
				tournamentId: tournamentId,
			},
		});
		var check = true;
		for (const event of tournamentEvents) {
			if (event.tournamentEventStatus !== TournamentEventStatus.ENDED) {
				check = false;
				break;
			}
		}
		if (check === true) {
			const tournamentUpdated = await this.prisma.tournament.update({
				where: {
					id: tournamentId,
				},
				data: {
					status: TournamentStatus.FINISHED,
				},
			});
			const tournamentParticipants =
				await this.prisma.tournamentParticipants.findMany({
					where: {
						tournamentId: tournamentId,
					},
				});
			const createPaybackFee = await this.prisma.paybackFee.create({
				data: {
					value: await this.createPaybackFeeForTournament(tournamentUpdated),
					isPaid: false,
					userId: tournamentUpdated.organizerId,
					tournamentId: tournamentUpdated.id,
				},
			});
		}
	}

	async createPaybackFeeForTournament(tournament: Tournament): Promise<number> {
		const tournamentEvents = await this.prisma.tournamentEvent.findMany({
			where: {
				tournamentId: tournament.id,
			},
		});
		var paybackFee = 0;
		for (const event of tournamentEvents) {
			const paybackFeePerEvent = await this.createPaybackFeeForTournamentEvent(
				event,
				tournament,
			);
			paybackFee += paybackFeePerEvent;
		}
		return paybackFee;
	}

	async createPaybackFeeForTournamentEvent(
		tournamentEvent: TournamentEvent,
		tournament: Tournament,
	): Promise<number> {
		const tournamentParticipants =
			await this.prisma.tournamentParticipants.findMany({
				where: {
					tournamentEventId: tournamentEvent.id,
				},
			});
		return await this.createPaybackFee(
			tournamentParticipants.length,
			tournamentEvent.tournamentEvent,
			tournament.registrationFeePerPerson,
		);
	}

	async createPaybackFee(
		numberOfParticipant: number,
		eventType: BadmintonParticipantType,
		eventFee: number,
	): Promise<number> {
		var paybackFee = 0;
		switch (eventType) {
			case "MENS_SINGLE":
				console.log(
					"number: " + numberOfParticipant + ", eventFee: " + eventFee,
				);
				paybackFee = numberOfParticipant * eventFee;
				console.log("fee: " + paybackFee);
				break;
			case "WOMENS_SINGLE":
				console.log(
					"number: " + numberOfParticipant + ", eventFee: " + eventFee,
				);
				paybackFee = numberOfParticipant * eventFee;
				console.log("fee: " + paybackFee);
				break;
			case "MENS_DOUBLE":
				console.log(
					"number: " + numberOfParticipant + ", eventFee: " + eventFee,
				);
				paybackFee = numberOfParticipant * eventFee * 2;
				console.log("fee: " + paybackFee);
				break;
			case "MENS_DOUBLE":
				console.log(
					"number: " + numberOfParticipant + ", eventFee: " + eventFee,
				);
				paybackFee = numberOfParticipant * eventFee * 2;
				console.log("fee: " + paybackFee);
				break;
			case "MENS_DOUBLE":
				console.log(
					"number: " + numberOfParticipant + ", eventFee: " + eventFee,
				);
				paybackFee = numberOfParticipant * eventFee * 2;
				console.log("fee: " + paybackFee);
				break;
		}
		return paybackFee;
	}

	async checkThirdPlaceMatchExistOrEnded(
		tournamentEvent: TournamentEvent,
	): Promise<boolean> {
		const thirdPlaceMatch = await this.prisma.match.findFirst({
			where: {
				stage: {
					stageName: {
						equals: StageOfMatch.ThirdPlaceMatch,
					},
				},
				tournamentEventId: tournamentEvent.id,
			},
		});
		console.log(thirdPlaceMatch);
		if (thirdPlaceMatch === null) return false;
		return (
			thirdPlaceMatch.matchWonByCompetitorId !== null ||
			thirdPlaceMatch.matchStatus === MatchStatus.ENDED
		);
	}

	async checkFinalMatchExistOrEnded(
		tournamentEvent: TournamentEvent,
	): Promise<boolean> {
		const finalMatch = await this.prisma.match.findFirst({
			where: {
				stage: {
					stageName: {
						equals: StageOfMatch.Final,
					},
				},
				tournamentEventId: tournamentEvent.id,
			},
		});
		// if (finalMatch === null) return false;
		return (
			finalMatch.matchWonByCompetitorId !== null ||
			finalMatch.matchStatus === MatchStatus.ENDED
		);
	}

	async processSemiFinalMatch(
		match: Match,
		competitorId: string,
	): Promise<any> {
		const tournamentEvent = await this.prisma.tournamentEvent.findUnique({
			where: {
				id: match.tournamentEventId,
			},
		});
		if (tournamentEvent.thirdPlacePrize !== null) {
			const thirdPlaceMatch = await this.getThirdPlaceMatch(
				match.tournamentEventId,
			);
			if (thirdPlaceMatch === null) {
				const createThirdPlaceMatch = await this.createThirdPlaceMatch(
					match.tournamentEventId,
				);
				const updatedThirdPlaceMatch = await this.updateThirdPlaceMatch(
					createThirdPlaceMatch.id,
					competitorId,
				);
				console.log(updatedThirdPlaceMatch);
			} else {
				const updatedThirdPlaceMatch = await this.updateThirdPlaceMatch(
					thirdPlaceMatch.id,
					competitorId,
				);
				console.log(updatedThirdPlaceMatch);
			}
		}
	}

	async isThirdPlaceMatch(match: Match): Promise<boolean> {
		const thirdPlaceStage = await this.prisma.stage.findFirst({
			where: {
				tournamentEventId: match.tournamentEventId,
				stageName: StageOfMatch.ThirdPlaceMatch,
			},
		});
		const thirdPlaceMatch = await this.prisma.match.findFirst({
			where: {
				stageId: thirdPlaceStage.id,
			},
		});
		return (await thirdPlaceMatch.id) === match.id;
	}

	async updateStandingOfTournamentEvent(currentMatchId: string): Promise<any> {
		const match = await this.prisma.match.findUnique({
			where: {
				id: currentMatchId,
			},
		});
		if (match.matchWonByCompetitorId === match.leftCompetitorId) {
			const tournamentEventUpdated = await this.prisma.tournamentEvent.update({
				where: {
					id: match.tournamentEventId,
				},
				data: {
					championshipId: match.leftCompetitorId,
					runnerUpId: match.rightCompetitorId,
				},
			});
		} else {
			const tournamentEventUpdated = await this.prisma.tournamentEvent.update({
				where: {
					id: match.tournamentEventId,
				},
				data: {
					championshipId: match.rightCompetitorId,
					runnerUpId: match.leftCompetitorId,
				},
			});
		}
	}

	async assignCompetitorForNextMatch(
		competitorId: string,
		nextMatchId: string,
		currentMatchId: string,
	): Promise<IGameAfterUpdatePointResponse> {
		const nextMatch = await this.prisma.match.findUnique({
			where: {
				id: nextMatchId,
			},
			select: {
				matchesPrevious: {
					orderBy: {
						matchNumber: "asc",
					},
				},
			},
		});
		console.log(nextMatch.matchesPrevious);
		if (currentMatchId === nextMatch.matchesPrevious[0].id) {
			const updatedNextMatch = await this.prisma.match.update({
				where: {
					id: nextMatchId,
				},
				data: {
					leftCompetitorId: competitorId,
				},
			});
		} else if (currentMatchId === nextMatch.matchesPrevious[1].id) {
			const updatedNextMatch = await this.prisma.match.update({
				where: {
					id: nextMatchId,
				},
				data: {
					rightCompetitorId: competitorId,
				},
			});
		}

		return {
			currentGameNumber: 0,
			currentPoint: await this.getAllGamesOfMatch(currentMatchId),
			currentServerId: competitorId,
			isGamePoint: false,
			isEnd: true,
			newGame: null,
			winningCompetitor: await this.getWinningCompetitor(competitorId),
			message: "Match ended!",
		};
	}

	transformGameData(game: Game): IPointOfGameResponse {
		return {
			id: game.id,
			gameNumber: game.gameNumber,
			left: game.leftCompetitorPoint,
			right: game.rightCompetitorPoint,
		};
	}

	async updateStartTimeForMatch(
		matchId: string,
		currentServerId: string,
	): Promise<Game> {
		const game = await this.prisma.game.create({
			data: {
				leftCompetitorPoint: 0,
				rightCompetitorPoint: 0,
				gameNumber: 1,
				matchId: matchId,
				currentServerId: currentServerId,
				timeStart: new Date(),
			},
		});
		const matchUpdated = await this.prisma.match.update({
			where: {
				id: matchId,
			},
			data: {
				startedWhen: convertToLocalTime(new Date()),
				matchStatus: MatchStatus.ON_GOING,
			},
		});
		return game;
	}

	async updateForfeitCompetitor(
		matchId: string,
		forfeitCompetitorId: string,
	): Promise<any> {
		return await this.prisma.match.update({
			where: {
				id: matchId,
			},
			data: {
				forfeitCompetitorId: forfeitCompetitorId,
			},
		});
	}

	async updateAttendance(
		matchId: string,
		leftCompetitorAttendance: boolean,
		rightCompetitorAttendance: boolean,
	): Promise<any> {
		console.log(leftCompetitorAttendance, " ", rightCompetitorAttendance);
		return await this.prisma.match.update({
			where: {
				id: matchId,
			},
			data: {
				leftCompetitorAttendance: leftCompetitorAttendance,
				rightCompetitorAttendance: rightCompetitorAttendance,
			},
		});
	}

	async getAllMatchesOfTournamentEvent(
		tournamentEventId: string,
	): Promise<any[]> {
		const tournamentEvent = await this.prisma.tournamentEvent.findUnique({
			where: {
				id: tournamentEventId,
			},
			select: {
				stages: {
					select: {
						matches: {
							select: {
								id: true,
								games: true,
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
												hands: true,
											},
										},
										partner: {
											select: {
												id: true,
												name: true,
												avatarURL: true,
												gender: true,
												height: true,
												hands: true,
											},
										},
									},
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
												hands: true,
											},
										},
										partner: {
											select: {
												id: true,
												name: true,
												avatarURL: true,
												gender: true,
												height: true,
												hands: true,
											},
										},
									},
								},
								matchStatus: true,
								stage: {
									select: {
										stageName: true,
										id: true,
									},
								},
								matchNumber: true,
								nextMatchId: true,
								startedWhen: true,
								umpire: {
									select: {
										id: true,
										name: true,
									},
								},
							},
							orderBy: {
								matchNumber: "desc",
							},
						},
					},
				},
			},
		});

		// const matches: IMatchQueryResponse[] = tournamentEvent.stages[0].matches;
		let matchesBeforeFormat = [];
		// console.log(tournamentEvent);
		tournamentEvent.stages.forEach((item) => {
			matchesBeforeFormat.push(...item.matches);
		});
		const matches = matchesBeforeFormat.map(this.transformMatchData);
		return matches;
	}

	transformMatchData(match) {
		return {
			id: match.id,
			participants: [
				match.leftCompetitor
					? {
							id: match.leftCompetitor.id,
							resultText: "Win",
							player1: {
								id: match.leftCompetitor.user.id,
								name: match.leftCompetitor.user.name,
								gender: match.leftCompetitor.user.gender,
							},
							player2: match.leftCompetitor.partner
								? {
										id: match.leftCompetitor.partner.id,
										name: match.leftCompetitor.partner.name,
										gender: match.leftCompetitor.partner.gender,
									}
								: null,
						}
					: null,
				match.rightCompetitor
					? {
							id: match.rightCompetitor.id,
							resultText: "Lose",
							player1: {
								id: match.rightCompetitor.user.id,
								name: match.rightCompetitor.user.name,
								gender: match.rightCompetitor.user.gender,
							},
							player2: match.rightCompetitor.partner
								? {
										id: match.rightCompetitor.partner.id,
										name: match.rightCompetitor.partner.name,
										gender: match.rightCompetitor.partner.gender,
									}
								: null,
						}
					: null,
			].filter(Boolean),
			state: match.matchStatus,
			tournamentRoundText: match.stage.stageName,
			name: `Match ${match.matchNumber}`,
			nextMatchId: match.nextMatchId,
			startTime: match.startedWhen || new Date().toISOString(),
			games: match.games,
		};
	}

	async createMultipleMatch(createMatches: ICreateMatch[]): Promise<any> {
		return await this.prisma.match.createManyAndReturn({
			data: createMatches,
		});
	}

	async getMatchDetail(matchId: string): Promise<Match> {
		return await this.prisma.match.findUnique({
			where: {
				id: matchId,
			},

			include: {
				tournamentEvent: {
					include: {
						tournament: true,
					},
				},
				court: true,
			},
		});
	}

	async updateThirdPlaceMatch(
		matchId: string,
		competitorId: string,
	): Promise<Match> {
		const match = await this.prisma.match.findUnique({
			where: {
				id: matchId,
			},
		});
		if (match.leftCompetitorId === null)
			return await this.prisma.match.update({
				where: {
					id: matchId,
				},
				data: {
					leftCompetitorId: competitorId,
				},
			});
		return await this.prisma.match.update({
			where: {
				id: matchId,
			},
			data: {
				rightCompetitorId: competitorId,
				nextMatchId: null,
			},
		});
	}

	async createThirdPlaceMatch(tournamentEventId: string): Promise<Match> {
		const stage = await this.prisma.stage.create({
			data: {
				stageName: StageOfMatch.ThirdPlaceMatch,
				tournamentEventId: tournamentEventId,
			},
		});
		return await this.prisma.match.create({
			data: {
				stageId: stage.id,
				matchNumber: 0,
				matchStatus: MatchStatus.NOT_STARTED,
				isByeMatch: false,
				nextMatchId: null,
				tournamentEventId: tournamentEventId,
			},
		});
	}

	async createMatch(match: Prisma.MatchCreateManyInput): Promise<any> {
		return await this.prisma.match.create({
			data: match,
		});
	}

	async getMatchesOfStage(stageId: string): Promise<Match[]> {
		return await this.prisma.match.findMany({
			where: {
				stageId: stageId,
			},
		});
	}

	async updateMatch(
		matchId: string,
		updateMatchDTO: UpdateMatchDTO,
	): Promise<Match> {
		try {
			return await this.prisma.match.update({
				where: { id: matchId },
				data: {
					...updateMatchDTO,
				},
			});
		} catch (e) {
			console.error("Update match failed", e);
			throw e;
		}
	}

	async getMatchesOfUser(userId: string): Promise<Match[]> {
		try {
			return this.prisma.match.findMany({
				where: {
					OR: [
						{
							leftCompetitor: {
								userId,
							},
						},

						{
							rightCompetitor: {
								userId,
							},
						},
					],
				},

				include: {
					tournamentEvent: {
						include: {
							tournament: true,
						},
					},

					court: true,
				},
			});
		} catch (e) {
			console.error("get matches of athlete failed", e);
			throw e;
		}
	}

	async getLatestMatchesOfUser(userId: string): Promise<Match[]> {
		try {
			return this.prisma.match.findMany({
				where: {
					matchStatus: MatchStatus.ENDED,
					timeEnd: {
						not: null,
					},
					OR: [
						{
							leftCompetitor: {
								userId,
							},
						},

						{
							rightCompetitor: {
								userId,
							},
						},
					],
				},

				include: {
					leftCompetitor: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									avatarURL: true,
									gender: true,
									height: true,
									hands: true,
								},
							},
							partner: {
								select: {
									id: true,
									name: true,
									avatarURL: true,
									gender: true,
									height: true,
									hands: true,
								},
							},
						},
					},
					rightCompetitor: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									avatarURL: true,
									gender: true,
									height: true,
									hands: true,
								},
							},
							partner: {
								select: {
									id: true,
									name: true,
									avatarURL: true,
									gender: true,
									height: true,
									hands: true,
								},
							},
						},
					},
					court: true,
					stage: true,
					games: true,
					tournamentEvent: {
						select: {
							tournament: true,
							tournamentEvent: true,
						},
					},
				},

				orderBy: {
					timeEnd: "desc",
				},
				take: 2,
			});
		} catch (error) {
			console.error("Failed to get two most recent ended matches:", error);
			throw error;
		}
	}

	async skipMatchesExceptFirstAndFinal(eventId: string): Promise<void> {
		const matches = await this.prisma.match.findMany({
			where: { tournamentEventId: eventId },
			include: {
				matchesPrevious: true,
				nextMatch: true,
			},
			orderBy: { matchNumber: "asc" },
		});

		const matchMap = new Map<string, Match>();
		matches.forEach((m) => matchMap.set(m.id, m));

		const visited = new Set<string>();
		const updates: Prisma.PrismaPromise<any>[] = [];

		const firstRoundMatches = matches.filter(
			(m) => m.matchesPrevious.length === 0,
		);
		if (firstRoundMatches.length === 0) {
			throw new Error("Không tìm thấy trận nào ở vòng đầu tiên.");
		}

		const firstMatchId = firstRoundMatches[0].id;

		const noNextMatches = matches.filter((m) => m.nextMatchId === null);

		const finalCandidates = noNextMatches.filter((candidate) => {
			const countRef = matches.filter(
				(m) => m.nextMatchId === candidate.id,
			).length;
			return countRef === 2;
		});

		if (finalCandidates.length === 0) {
			throw new Error("Không tìm thấy trận chung kết.");
		}
		if (finalCandidates.length > 1) {
			throw new Error("Tìm thấy nhiều hơn 1 trận có vẻ là chung kết.");
		}

		const finalMatchId = finalCandidates[0].id;

		const thirdPlaceMatch = noNextMatches.find((m) => m.id !== finalMatchId);

		console.log(thirdPlaceMatch);

		const generateScore = (): [number, number] => {
			const loserScore = Math.floor(Math.random() * 10) + 10; // 10–19
			return [21, loserScore];
		};

		const createBestOfThreeGames = (
			match: Match,
			winnerId: string,
		): Prisma.PrismaPromise<any>[] => {
			const gameUpdates: Prisma.PrismaPromise<any>[] = [];
			let winnerGames = 0;
			let gameNumber = 1;

			while (winnerGames < 2) {
				const [winScore, loseScore] = generateScore();

				const leftScore =
					match.leftCompetitorId === winnerId ? winScore : loseScore;
				const rightScore =
					match.leftCompetitorId === winnerId ? loseScore : winScore;

				gameUpdates.push(
					this.prisma.game.create({
						data: {
							matchId: match.id,
							gameNumber,
							leftCompetitorPoint: leftScore,
							rightCompetitorPoint: rightScore,
							status: "ENDED",
							timeStart: new Date(),
							timeEnd: new Date(),
							gameWonByCompetitorId: winnerId,
						},
					}),
				);

				winnerGames++;
				gameNumber++;
			}

			return gameUpdates;
		};

		const skipRecursive = (match: Match) => {
			if (visited.has(match.id)) return;
			visited.add(match.id);

			if (match.id === firstMatchId || match.id === finalMatchId) return;

			if (match.matchStatus === MatchStatus.ENDED) return;

			if (!match.leftCompetitorId && !match.rightCompetitorId) return;

			const winnerId = match.leftCompetitorId ?? match.rightCompetitorId;

			updates.push(...createBestOfThreeGames(match, winnerId));

			// Đánh dấu trận hiện tại là đã kết thúc
			updates.push(
				this.prisma.match.update({
					where: { id: match.id },
					data: {
						matchStatus: MatchStatus.ENDED,
						matchWonByCompetitorId: winnerId,
						startedWhen: new Date(),
						timeStart: new Date(),
						timeEnd: new Date(),
					},
				}),
			);

			if (match.nextMatchId) {
				const nextMatch = matchMap.get(match.nextMatchId);
				if (nextMatch) {
					let updatedNextMatch = { ...nextMatch };

					const updateNextData: any = {};

					// Chỉ update nếu slot còn trống
					if (!nextMatch.leftCompetitorId) {
						updateNextData.leftCompetitorId = winnerId;
						updatedNextMatch.leftCompetitorId = winnerId;
					} else if (!nextMatch.rightCompetitorId) {
						updateNextData.rightCompetitorId = winnerId;
						updatedNextMatch.rightCompetitorId = winnerId;
					}

					// Cập nhật database
					if (Object.keys(updateNextData).length > 0) {
						updates.push(
							this.prisma.match.update({
								where: { id: nextMatch.id },
								data: updateNextData,
							}),
						);

						// Update local matchMap để dùng trong lần đệ quy tiếp theo
						matchMap.set(nextMatch.id, updatedNextMatch);
					}

					// Tiếp tục đệ quy với bản đã cập nhật
					skipRecursive(updatedNextMatch);
				}
			}
		};

		// Bắt đầu từ các trận ở vòng đầu tiên (trừ trận đầu tiên)
		for (const match of firstRoundMatches) {
			if (match.id !== firstMatchId) {
				skipRecursive(match);
			}
		}

		await this.prisma.$transaction(updates);

		if (thirdPlaceMatch) {
			const semifinalMatches = await this.prisma.match.findMany({
				where: { nextMatchId: finalMatchId },
				include: {
					leftCompetitor: true,
					rightCompetitor: true,
					matchWonByCompetitor: true,
				},
			});

			if (semifinalMatches.length !== 2) {
				throw new Error("Không xác định được 2 trận bán kết.");
			}

			const loserIds: string[] = [];

			for (const semi of semifinalMatches) {
				const { leftCompetitorId, rightCompetitorId, matchWonByCompetitorId } =
					semi;

				const loserId =
					matchWonByCompetitorId === leftCompetitorId
						? rightCompetitorId
						: leftCompetitorId;

				if (loserId) loserIds.push(loserId);
			}

			if (loserIds.length === 2) {
				await this.prisma.match.update({
					where: { id: thirdPlaceMatch.id },
					data: {
						leftCompetitorId: loserIds[0],
						rightCompetitorId: loserIds[1],
					},
				});

				const [winnerId, loserId] = [loserIds[0], loserIds[1]];

				const gamePromises = createBestOfThreeGames(
					thirdPlaceMatch,
					winnerId,
					loserId,
				);

				await this.prisma.$transaction([
					...gamePromises,
					this.prisma.match.update({
						where: { id: thirdPlaceMatch.id },
						data: {
							matchStatus: MatchStatus.ENDED,
							matchWonByCompetitorId: winnerId,
							startedWhen: new Date(),
							timeStart: new Date(),
							timeEnd: new Date(),
						},
					}),
				]);
			}
		}
	}

	async assignPlayersToFirstRoundMatches(tournamentEventId: string) {
		const participants = await this.prisma.tournamentParticipants.findMany({
			where: { tournamentEventId },
			orderBy: { id: "asc" }, // Sắp xếp để đảm bảo thứ tự nhất quán
		});

		const countMatches = await this.prisma.match.count({
			where: {
				tournamentEventId,
			},
		});

		const firstRoundMatches = await this.prisma.match.findMany({
			where: {
				tournamentEventId,
				matchesPrevious: {
					none: {}, // Chỉ vòng đầu
				},

				matchNumber: { not: countMatches },
			},
			orderBy: { matchNumber: "asc" },
		});

		const updates = [];

		for (
			let i = 0, matchIndex = 1;
			i < participants.length && matchIndex < firstRoundMatches.length;
			matchIndex++
		) {
			const match = firstRoundMatches[matchIndex];
			const left = participants[i];
			const right = participants[i + 1];

			if (right) {
				// Gán đủ 2 người
				updates.push(
					this.prisma.match.update({
						where: { id: match.id },
						data: {
							leftCompetitorId: left.id,
							rightCompetitorId: right.id,
							isByeMatch: false,
						},
					}),
				);
				i += 2;
			} else {
				// Trận "bye"
				updates.push(
					this.prisma.match.update({
						where: { id: match.id },
						data: {
							leftCompetitorId: left.id,
							isByeMatch: true,
						},
					}),
				);
				i += 1;
			}
		}

		await this.prisma.$transaction(updates);

		return;
	}
}
