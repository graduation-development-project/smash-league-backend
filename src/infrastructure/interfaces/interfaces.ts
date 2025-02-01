import { User } from "@prisma/client";

export interface IPayload {
	userID: number;
}

export interface ISignInResponse {
	accessToken: string;
	refreshToken: string;
}

export interface ISignUpResponse {
	accessToken: string;
	refreshToken: string;
}

export interface IRequestUser extends Request {
	user: User;
}
