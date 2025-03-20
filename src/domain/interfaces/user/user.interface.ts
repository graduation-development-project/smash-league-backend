export interface IUserResponse {
	id: string;
	email: string;
	name: string;
	phoneNumber: string;
	avatarURL: string;
	isVerified: boolean;
}

export interface IUserDefaultResponse {
	id: string;
	name: string;
	phoneNumber: string;
	email: string;
}
