import { User } from "@prisma/client";
import { TUserWithRole } from "../types/users.type";

export interface IPayload {
	userID: string;
	roles: string[];
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
	user: TUserWithRole;
}
