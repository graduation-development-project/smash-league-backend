import { Inject, Injectable } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/repositories/users.repository.port";
import { User } from "@prisma/client";

@Injectable()
export class GetUserByIdUseCase {
	constructor(
		@Inject("UserRepository")
		private readonly userRepository: UsersRepositoryPort,
	) {}

	async execute(userID: string): Promise<User> {
		return await this.userRepository.findUserById(userID);
	}
}
