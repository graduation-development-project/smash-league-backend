import { Gender } from "@prisma/client";

export interface IUserResponse {
	id: string;
	email: string;
	name: string;
	phoneNumber: string;
	avatarURL: string;
	isVerified: boolean;
	gender: Gender;
	dateOfBirth: Date;
}

export interface IUserDefaultResponse {
	id: string;
	name: string;
	phoneNumber: string;
	email: string;
}
