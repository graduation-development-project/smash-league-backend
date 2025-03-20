import {
	IsDate,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsPhoneNumber,
	IsString,
	IsStrongPassword,
	MaxLength,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "../users/create-user.dto";
import { Gender } from "@prisma/client";
import {Transform} from "class-transformer";

export class SignUpDTO extends PartialType(CreateUserDTO) {
	@IsNotEmpty()
	@MaxLength(120)
	name: string;

	@IsNotEmpty()
	@MaxLength(50)
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsPhoneNumber("VN")
	phoneNumber: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;

	@IsEnum([Gender.MALE, Gender.FEMALE])
	@IsNotEmpty()
	gender: Gender;

	@Transform(({ value }) => new Date(value))
	@IsDate()
	@IsNotEmpty()
	dateOfBirth: Date;
}
