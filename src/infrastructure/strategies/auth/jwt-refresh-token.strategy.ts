import {Request} from "express";
import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {IPayload} from "../../../domain/interfaces/interfaces";
import {GetUserWithRefreshTokenUseCase} from "../../../application/usecases/users/get-user-with-refresh-token.usecase";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    "refresh_token",
) {
    constructor(
        private readonly getUserWithRefreshTokenUseCase: GetUserWithRefreshTokenUseCase,
        private config_service: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config_service.get("REFRESH_TOKEN_SECRET_KEY"),
            passReqToCallback: true,
        });
    }
    /**
     * function signIn() {
     *      const dto = {usename}
     *      await authenRepo.signIn(interface ({usename, password}))
     * }
     * @param request 
     * @param payload 
     * @returns 
     */
    async validate(request: Request, payload: IPayload) {
        return await this.getUserWithRefreshTokenUseCase.execute(
            payload.userID,
            request.headers.authorization.split("Bearer ")[1],
        );
    }
}
