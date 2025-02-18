import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { GetAuthenticatedUserUseCase } from "../../../application/usecases/users/get-authenticated-user.usecase";
import { User } from "@prisma/client";
import { SignInDTO } from "../../../domain/dtos/auth/sign-in.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly getAuthenticatedUserUseCase: GetAuthenticatedUserUseCase,
	) {
		// @ts-ignore
		super({ usernameField: "email" }); //* Default is username, change to email
	}

	async validate(email: string, password: string): Promise<User> {

		// console.log(email, password);

		const user: User = await this.getAuthenticatedUserUseCase.execute(
			email,
			password,
		);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
