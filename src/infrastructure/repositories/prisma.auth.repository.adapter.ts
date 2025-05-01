import * as bcrypt from "bcryptjs";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { AuthRepositoryPort } from "../../domain/repositories/auth.repository.port";
import { SignUpDTO } from "../../domain/dtos/auth/sign-up.dto";
import {
	IPayload,
	ISignInResponse,
	ISignUpResponse,
} from "../../domain/interfaces/interfaces";
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
import { TUserWithRole } from "../types/users.type";
import { verifyOTP } from "../util/verify-otp.util";

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
	refreshAccessToken(userID: string, roles: string[]): string {
		try {
			return this.generateAccessToken({
				userID,
				roles,
			});
		} catch (e) {
			throw new BadRequestException("refresh access token failed");
		}
	}

	async signIn(user: TUserWithRole): Promise<ISignInResponse> {
		try {
			const userSignIn = await this.prisma.user.findUnique({
				where: { id: user.id },
				include: {
					userRoles: {
						include: {
							role: true,
						},
					},
				},
			});
			const roles = userSignIn.userRoles.map((item) => item.role.roleName);
			const accessToken = this.generateAccessToken({
				userID: user.id,
				roles: user.userRoles,
			});
			const refreshToken = this.generateRefreshToken({
				userID: user.id,
				roles: user.userRoles,
			});
			await this.storeRefreshToken(user.id, refreshToken);

			return {
				accessToken: accessToken,
				refreshToken: refreshToken,
				email: userSignIn.email,
				name: userSignIn.name,
				roles,
				id: userSignIn.id,
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

			const phoneNumberExisted = await this.prisma.user.findUnique({
				where: {
					phoneNumber: signUpDTO.phoneNumber,
				},
			});

			if (phoneNumberExisted) {
				throw new BadRequestException("phone number already exists");
			}

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
			console.log(otpExpiresTime);
			console.log(new Date());

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

	async resendOTP(email: string): Promise<string> {
		try {
			const userExisted: UserEntity | null = await this.prisma.user.findUnique({
				where: { email },
			});

			if (!userExisted) {
				throw new BadRequestException("Email is not registered yet");
			}

			const otp: string = generateOtpCode();
			const otpExpiresTime: Date = new Date();
			otpExpiresTime.setMinutes(otpExpiresTime.getMinutes() + 10);

			await this.prisma.user.update({
				where: { email },
				data: {
					otp,
					otpExpiresTime: otpExpiresTime,
				},
			});

			await this.emailQueue.add("sendEmail", {
				to: email,
				subject: "Verify Your Account",
				template: "OTP.hbs",
				context: {
					otp,
				},
			});
		} catch (e) {
			throw e;
		}

		return "Resend OTP completed";
	}

	async verifyOTP(email: string, otp: string): Promise<string> {
		try {
			await verifyOTP(email, otp, this.prisma);

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

			const otp: string = generateOtpCode();
			const otpExpiresTime: Date = new Date();
			otpExpiresTime.setMinutes(otpExpiresTime.getMinutes() + 10);

			await this.prisma.user.update({
				where: { email },
				data: {
					otp,
					otpExpiresTime: otpExpiresTime,
				},
			});

			await this.emailQueue.add("sendEmail", {
				to: email,
				subject: "Password Reset",
				template: "reset-password.hbs",
				context: {
					otp,
				},
			});

			return "Reset Password Link is sent";
		} catch (e) {
			throw e;
		}
	}

	async resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<string> {
		const { password, otp, email } = resetPasswordDTO;

		try {
			await verifyOTP(email, otp, this.prisma);

			const hashedPassword: string = await bcrypt.hash(
				password,
				this.SALT_ROUND,
			);

			await this.prisma.user.update({
				where: { email },
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
