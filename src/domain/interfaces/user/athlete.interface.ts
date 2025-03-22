export interface IParticipantsResponse {
	user: IAthleteResponse;
	partner?: IAthleteResponse;
}

export interface IAthleteResponse {
	id: string;
	name: string;
	phoneNumber: string;
	email: string;
	gender: string;
	hands: string;
	height: number;
	dateOfBirth: Date;
}



