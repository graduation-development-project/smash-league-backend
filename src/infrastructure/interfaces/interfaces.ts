import { User } from "@prisma/client";

export interface IPayload {
	userID: string;
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

export interface IPaginatedOutput<T> {
	data: T[];
	meta: {
		total: number;
		lastPage: number;
		currentPage: number;
		totalPerPage: number;
		prevPage: number | null;
		nextPage: number | null;
	};
}

export interface IPaginateOptions {
	page?: number;
	perPage?: number;
}
