import { User } from "@prisma/client";
import { SignUpDTO } from "../../infrastructure/dto/auth/sign-up.dto";
import {
	IRequestUser,
	ISignInResponse,
	ISignUpResponse,
} from "../../infrastructure/interfaces/interfaces";

export interface AuthRepositoryPort {
	signIn(userID: string): Promise<ISignInResponse>;

	signUp(signUpDTO: SignUpDTO): Promise<string>;

	refreshAccessToken(userID: string): string;

	verifyOTP(email: string, otp: string): Promise<string>;
}
