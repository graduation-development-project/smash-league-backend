import { User } from "@prisma/client";
import { SignUpDTO } from "../../dtos/auth/sign-up.dto";
import {
	IRequestUser,
	ISignInResponse,
	ISignUpResponse,
} from "../interfaces";
import { ResetPasswordDTO } from "../../dtos/auth/reset-password.dto";
import { TUserWithRole } from "src/infrastructure/types/users.type";

export interface AuthRepositoryPort {
	signIn(user: TUserWithRole): Promise<ISignInResponse>;

	signUp(signUpDTO: SignUpDTO): Promise<string>;

	refreshAccessToken(userID: string, roles: string[]): string;

	resendOTP(email: string): Promise<string>;

	verifyOTP(email: string, otp: string): Promise<string>;

	sendResetPasswordLink(email: string): Promise<string>;

	resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<string>;
}
