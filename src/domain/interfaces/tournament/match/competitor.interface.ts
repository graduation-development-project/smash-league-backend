export interface ICompetitorResponse {
	id: string;
	name: string;
	avatarURL: string;
	gender: string;
	height: string;
	hands: string;
}

export interface IParticipantResponse {
	id: string;
	user: ICompetitorResponse;
	partner?: ICompetitorResponse;
}