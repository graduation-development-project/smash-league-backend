import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { IPayload } from "../../interfaces/interfaces";
import { GetUserByIdUseCase } from "../../../application/usecases/users/get-user-by-id.usecase";

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly getUserByIdUseCase: GetUserByIdUseCase,
		private config_service: ConfigService,
	) {
		// @ts-ignore
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config_service.get("ACCESS_TOKEN_SECRET_KEY"),
		});
	}

	async validate(payload: IPayload) {
		return await this.getUserByIdUseCase.execute(payload.userID);
	}
}
