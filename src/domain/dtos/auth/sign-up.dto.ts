import {
	IsEmail,
	IsNotEmpty,
	IsPhoneNumber,
	IsStrongPassword,
	MaxLength,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "../users/create-user.dto";

export class SignUpDTO extends PartialType(CreateUserDTO) {
	@IsNotEmpty()
	@MaxLength(50)
	firstName: string;

	@IsNotEmpty()
	@MaxLength(50)
	lastName: string;

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
}
