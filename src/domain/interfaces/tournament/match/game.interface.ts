import { Game } from "@prisma/client";

export interface IGameAfterUpdatePointResponse {
	isEnd: boolean;
	message: string;
	currentServerId: string;
	isGamePoint: boolean;
	winningCompetitor?: IWonCompetitorResponse;
	currentGameNumber: number;
	currentPoint: IPointOfGameResponse[];
	newGame?: Game;
}

export interface IWonCompetitorResponse {
	id: string;
	userName: string;
	partnerName: string;
}

export interface IPointOfGameResponse {
	id: string;
	gameNumber: number;
	left: number;
	right: number;
}