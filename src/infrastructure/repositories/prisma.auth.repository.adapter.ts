import * as bcrypt from "bcryptjs";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { AuthRepositoryPort } from "../../domain/repositories/auth.repository.port";
import { SignUpDTO } from "../../domain/dtos/auth/sign-up.dto";
import {
	IPayload,
	ISignInResponse,
	ISignUpResponse,
} from "../interfaces/interfaces";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersRepositoryPort } from "../../domain/repositories/users.repository.port";
import { MailService } from "../services/mail.service";
import { generateOtpCode } from "../util/generate-otp-code.util";
import { convertToLocalTime } from "../util/convert-to-local-time.util";
import { ResetPasswordDTO } from "../../domain/dtos/auth/reset-password.dto";
import { UserEntity } from "src/domain/entities/authentication/user.entity";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class PrismaAuthRepositoryAdapter implements AuthRepositoryPort {
	private SALT_ROUND = 10;

	constructor(
		private prisma: PrismaClient,
		@Inject("UserRepository") private userRepository: UsersRepositoryPort,
		private jwtService: JwtService,
		private configService: ConfigService,
		private mailService: MailService,
		@InjectQueue("emailQueue") private emailQueue: Queue,
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

	async signUp(signUpDTO: SignUpDTO): Promise<any> {
		try {
			const userExisted: UserEntity | null = await this.prisma.user.findUnique({
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
			console.log(convertToLocalTime(new Date()));

			const user: User = await this.userRepository.createUser({
				...signUpDTO,
				password: hashedPassword,
				otp,
				otpExpiresTime: convertToLocalTime(otpExpiresTime),
			});

			await this.emailQueue.add("sendEmail", {
				to: user.email,
				subject: "Verify Your Account",
				template: "OTP.hbs",
				context: {
					otp,
				},
			});

			return {
				email: user.email,
			};
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

			console.log(user.otpExpiresTime, " - ", convertToLocalTime(new Date()));

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

	async sendResetPasswordLink(email: string): Promise<string> {
		try {
			const user: User = await this.prisma.user.findUnique({
				where: { email },
			});

			if (!user) {
				throw new BadRequestException("This email is not registered yet");
			}

			if (!user.isVerified) {
				throw new BadRequestException("Your account is not verified");
			}

			const token: string = this.jwtService.sign(
				{ email },
				{
					secret: this.configService.get<string>("RESET_TOKEN_SECRET_KEY"),
					expiresIn: `${this.configService.get<string>("RESET_TOKEN_EXPIRATION_TIME")}s`,
				},
			);

			const url = `${this.configService.get("EMAIL_RESET_PASSWORD_URL")}?token=${token}`;

			await this.emailQueue.add("sendEmail", {
				to: user.email,
				subject: "Password Reset",
				template: "reset-password.hbs",
				context: {
					name: user.firstName,
					resetLink: url,
					expiresIn: "10",
				},
			});

			return "Reset Password Link is sent";
		} catch (e) {
			throw e;
		}
	}

	async resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<string> {
		const { token, password } = resetPasswordDTO;

		try {
			//* Decode reset token
			const payload = await this.jwtService.verify(token, {
				secret: this.configService.get("RESET_TOKEN_SECRET_KEY"),
			});

			if (!payload?.email) {
				throw new BadRequestException("Invalid token payload");
			}

			const hashedPassword = await bcrypt.hash(password, this.SALT_ROUND);

			await this.prisma.user.update({
				where: { email: payload.email },
				data: { password: hashedPassword },
			});

			return "Reset Password Successfully";
		} catch (error) {
			if (error?.name === "TokenExpiredError") {
				throw new BadRequestException("Reset token has expired");
			}
			throw new BadRequestException("Invalid or expired reset token");
		}
	}
}
