import { Inject, Injectable } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/repositories/users.repository.port";
import { User } from "@prisma/client";
import { TUserWithRole } from "../../../infrastructure/types/users.type";

@Injectable()
export class GetUserByIdUseCase {
	constructor(
		@Inject("UserRepository")
		private readonly userRepository: UsersRepositoryPort,
	) {}

	async execute(userID: string): Promise<TUserWithRole> {
		return await this.userRepository.findUserById(userID);
	}
}
