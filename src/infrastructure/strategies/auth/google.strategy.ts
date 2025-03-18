import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../../../application/services/auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	constructor(
		private configService: ConfigService,
		private authService: AuthService,
	) {
		// @ts-ignore
		super({
			clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
			clientSecret: configService.get<string>("GOOGLE_SECRET"),
			callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
			scope: ["email", "profile"],
			// passReqToCallback: true,
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback,
	): Promise<any> {
		const { name, emails, photos } = profile;

		const userGoogle = {
			name: `${String(name.givenName)} ${String(name.familyName)}`,
			avatarURL: String(photos[0].value),
			password: "",
			email: String(emails[0].value),
			phoneNumber: "",
			provider: "google",
		};

		return await this.authService.validateGoogleAccount(userGoogle);
	}
}
