import {
	IsDate,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsStrongPassword,
	MaxLength,
} from "class-validator";
import { Gender } from "@prisma/client";
import {Transform} from "class-transformer";

export class CreateUserDTO {
	@IsNotEmpty()
	@MaxLength(120)
	name: string;

	@IsNotEmpty()
	@MaxLength(50)
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;

	@IsNotEmpty()
	@IsString()
	phoneNumber: string;

	@IsOptional()
	@IsString()
	avatarURL?: string;

	@IsOptional()
	@IsString()
	currentRefreshToken?: string;

	@IsOptional()
	@IsString()
	otp?: string;

	@IsOptional()
	@IsDate()
	otpExpiresTime?: Date;

	@IsOptional()
	provider?: String;

	@IsEnum([Gender.MALE, Gender.FEMALE])
	@IsNotEmpty()
	gender: Gender;

	@Transform(({ value }) => new Date(value))
	@IsDate()
	@IsNotEmpty()
	dateOfBirth: Date;
}
