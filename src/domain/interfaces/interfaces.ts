import { User } from "@prisma/client";
import { TUserWithRole } from "../../infrastructure/types/users.type";

export interface IPayload {
	userID: string;
	roles: string[];
}

export interface ISignInResponse {
	accessToken: string;
	refreshToken: string;
	email: string;
	id: string;
	roles: string[];
	name: string;
}

export interface ISignUpResponse {
	accessToken: string;
	refreshToken: string;
}

export interface IRequestUser extends Request {
	user: TUserWithRole;
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

export interface GetRegistrationStatsInput {
	organizerId: string;
	period: 'daily' | 'weekly' | 'monthly' | 'yearly';
	fromDate?: Date;
	toDate?: Date;
}

