export interface IGameAfterUpdatePointResponse {
	isEnd: boolean;
	message: string;
	currentServerId: string;
	winningCompetitor?: IWonCompetitorResponse;
	currentGameNumber: number;
	currentPoint: IPointOfGameResponse[];
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