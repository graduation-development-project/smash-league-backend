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
import { TournamentsRepositoryPort } from "../../domain/repositories/tournaments.repository";

@Injectable()
export class PrismaTournamentsRepositoryAdapter implements TournamentsRepositoryPort {
	private SALT_ROUND = 10;

	constructor(private prisma: PrismaClient) {
	}


}
