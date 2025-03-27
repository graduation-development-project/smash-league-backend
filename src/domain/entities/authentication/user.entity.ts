import { Gender, Hands } from "@prisma/client";

export class UserEntity {
	id: string;
	email: string;
	name: string;
	phoneNumber: string;
	avatarURL?: string;
	currentRefreshToken?: string;
	creditsRemain?: number;
	otp?: string;
	gender?: Gender;
	otpExpiresTime?: Date;
	isVerified: boolean;
	teamId?: string;
	height?: number;
	hands?: Hands;
	dateOfBirth?: Date;
}
