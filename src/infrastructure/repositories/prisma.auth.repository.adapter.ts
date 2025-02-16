import * as bcrypt from "bcryptjs";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { AuthRepositoryPort } from "../../domain/repositories/auth.repository.port";
import { SignUpDTO } from "../dto/auth/sign-up.dto";
import {
	IPayload,
	ISignInResponse,
	ISignUpResponse,
} from "../interfaces/interfaces";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersRepositoryPort } from "../../domain/repositories/users.repository.port";
import { MailService } from "../service/mail.service";
import { generateOtpCode } from "../util/generate-otp-code.util";
import { convertToLocalTime } from "../util/convert-to-local-time.util";

@Injectable()
export class PrismaAuthRepositoryAdapter implements AuthRepositoryPort {
	private SALT_ROUND = 10;

	constructor(
		private prisma: PrismaClient,
		@Inject("UserRepository") private userRepository: UsersRepositoryPort,
		private jwtService: JwtService,
		private configService: ConfigService,
		private mailService: MailService,
	) {}

	generateAccessToken(payload: IPayload) {
		return this.jwtService.sign(payload, {
			secret: this.configService.get<string>("ACCESS_TOKEN_SECRET_KEY"),
			expiresIn: `${this.configService.get<string>(
				"JWT_ACCESS_TOKEN_EXPIRATION_TIME",
			)}s`,
		});
	}

	generateRefreshToken(payload: IPayload) {
		return this.jwtService.sign(payload, {
			secret: this.configService.get<string>("REFRESH_TOKEN_SECRET_KEY"),
			expiresIn: `${this.configService.get<string>(
				"JWT_REFRESH_TOKEN_EXPIRATION_TIME",
			)}s`,
		});
	}

	async storeRefreshToken(userID: string, token: string): Promise<void> {
		try {
			const hashed_token = await bcrypt.hash(token, this.SALT_ROUND);
			await this.prisma.user.update({
				where: { id: userID },
				data: { currentRefreshToken: hashed_token },
			});
		} catch (e) {
			throw new BadRequestException("store refresh token failed");
		}
	}

	//* Use refresh token to generate new access token
	refreshAccessToken(userID: string): string {
		try {
			return this.generateAccessToken({ userID });
		} catch (e) {
			throw new BadRequestException("refresh access token failed");
		}
	}

	async signIn(userID: string): Promise<ISignInResponse> {
		try {
			const accessToken = this.generateAccessToken({
				userID,
			});
			const refreshToken = this.generateRefreshToken({
				userID,
			});
			await this.storeRefreshToken(userID, refreshToken);

			return {
				accessToken,
				refreshToken,
			};
		} catch (e) {
			throw e;
		}
	}

	async signUp(signUpDTO: SignUpDTO): Promise<string> {
		try {
			const userExisted = await this.prisma.user.findUnique({
				where: { email: signUpDTO.email },
			});

			if (userExisted) {
				throw new BadRequestException("Email already in used");
			}

			const hashedPassword = await bcrypt.hash(
				signUpDTO.password,
				this.SALT_ROUND,
			);

			const otp: string = generateOtpCode();
			const otpExpiresTime: Date = new Date();
			otpExpiresTime.setMinutes(otpExpiresTime.getMinutes() + 10);

			console.log(convertToLocalTime(otpExpiresTime));

			const user: User = await this.userRepository.createUser({
				...signUpDTO,
				password: hashedPassword,
				otp,
				otpExpiresTime: convertToLocalTime(otpExpiresTime),
			});

			await this.mailService.sendEmail(
				user.email,
				"Verify Your Account",
				"OTP.hbs",
				{ otp },
			);

			return "Sign Up successfully";
		} catch (e) {
			throw e;
		}
	}

	async verifyOTP(email: string, otp: string): Promise<string> {
		try {
			const user: User = await this.prisma.user.findUnique({
				where: { email },
			});

			if (!user) {
				throw new BadRequestException("This email is not registered yet");
			}

			//* Check OTP expires or not
			if (user.otpExpiresTime < convertToLocalTime(new Date())) {
				throw new BadRequestException("OTP expired");
			}

			if (user.otp !== otp) {
				throw new BadRequestException("Invalid OTP");
			}

			await this.prisma.user.update({
				where: { email },
				data: {
					isVerified: true,
					otp: null,
					otpExpiresTime: null,
				},
			});

			return "Account verified successfully";
		} catch (e) {
			throw e;
		}
	}
}
