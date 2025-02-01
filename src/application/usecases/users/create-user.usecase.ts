import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/repositories/users.repository.port";
import { User } from "@prisma/client";
import { CreateUserDTO } from "../../../infrastructure/dto/users/create-user.dto";

@Injectable()
export class CreateUserUseCase {
	constructor(
		@Inject("UserRepository") private userRepository: UsersRepositoryPort,
	) {}

	async execute(createUserDTO: CreateUserDTO): Promise<User> {
		return this.userRepository.createUser(createUserDTO);
	}
}
