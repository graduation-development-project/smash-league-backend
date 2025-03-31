import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/services/prisma.service";
import { User } from "@prisma/client";
import { UsersRepositoryPort } from "../../domain/repositories/users.repository.port";
import {CreateUserDTO} from "../../domain/dtos/users/create-user.dto";

@Injectable()
export class AuthService {
	constructor(
		private prismaService: PrismaService,
		@Inject("UserRepository") private userRepository: UsersRepositoryPort,
	) {}

	async validateGoogleAccount(googleUser: CreateUserDTO): Promise<User> {
		const user: User = await this.prismaService.user.findUnique({
			where: {
				email: googleUser.email,
			},
		});

		if (user) return user;

		return this.userRepository.createUser(googleUser);
	}
}
