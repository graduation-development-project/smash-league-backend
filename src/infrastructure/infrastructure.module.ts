import { Module } from "@nestjs/common";
import { ApplicationController } from "./controllers/application.controller";
import { ApplicationFunction } from "src/application/usecases/application.function";
import { ApplicationModule } from "src/application/application.module";
import { UsersController } from "./controllers/users.controller";
import { LocalStrategy } from "./strategies/auth/local.strategy";
import { JwtAccessTokenStrategy } from "./strategies/auth/jwt-access-token.strategy";
import { JwtRefreshTokenStrategy } from "./strategies/auth/jwt-refresh-token.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./controllers/auth.controller";

@Module({
	imports: [ApplicationModule, PassportModule, JwtModule.register({})],
	controllers: [ApplicationController, UsersController, AuthController],
	providers: [LocalStrategy, JwtAccessTokenStrategy, JwtRefreshTokenStrategy],
	exports: [],
})
export class InfrastructureModule {
}
