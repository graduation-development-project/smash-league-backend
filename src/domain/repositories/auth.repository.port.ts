import { User } from "@prisma/client";
import { SignUpDTO } from "../dtos/auth/sign-up.dto"
import {
	IRequestUser,
	ISignInResponse,
	ISignUpResponse,
} from "../../infrastructure/interfaces/interfaces";
import {ResetPasswordDTO} from "../dtos/auth/reset-password.dto";

export interface AuthRepositoryPort {
	signIn(userID: string): Promise<ISignInResponse>;

	signUp(signUpDTO: SignUpDTO): Promise<string>;

	refreshAccessToken(userID: string): string;

	verifyOTP(email: string, otp: string): Promise<string>;

	sendResetPasswordLink(email: string): Promise<string>;

	resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<string>;
}
