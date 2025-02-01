import { User } from "@prisma/client";
import { SignUpDTO } from "../../infrastructure/dto/auth/sign-up.dto";
import {
	IRequestUser,
	ISignInResponse,
	ISignUpResponse,
} from "../../infrastructure/interfaces/interfaces";

export interface AuthRepositoryPort {
	signIn(userID: number): Promise<ISignInResponse>;

	signUp(signUpDTO: SignUpDTO): Promise<ISignUpResponse>;

	refreshAccessToken(userID: number): string;
}
