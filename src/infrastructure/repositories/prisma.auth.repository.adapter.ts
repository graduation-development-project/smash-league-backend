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

@Injectable()
export class PrismaAuthRepositoryAdapter implements AuthRepositoryPort {
	private SALT_ROUND = 10;

	constructor(
		private prisma: PrismaClient,
		@Inject("UserRepository") private userRepository: UsersRepositoryPort,
		private jwtService: JwtService,
		private configService: ConfigService,
	) {
	}

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


	async storeRefreshToken(userID: number, token: string): Promise<void> {
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
	refreshAccessToken(userID: number): string {
		try {
			return this.generateAccessToken({ userID });
		} catch (e) {
			throw new BadRequestException("refresh access token failed");
		}
	}

	async signIn(userID: number): Promise<ISignInResponse> {
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

	async signUp(signUpDTO: SignUpDTO): Promise<ISignUpResponse> {
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

			// console.log("hashedPassword", hashedPassword);

			const user: User = await this.userRepository.createUser({
				...signUpDTO,
				password: hashedPassword,
			});

			const refreshToken = this.generateRefreshToken({
				userID: user.id,
			});

			const accessToken = this.generateAccessToken({
				userID: user.id,
			});

			await this.storeRefreshToken(user.id, refreshToken);

			return {
				accessToken,
				refreshToken,
			};
		} catch (e) {
			throw e;
		}
	}
}
