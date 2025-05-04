import { Inject, Injectable } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/repositories/users.repository.port";
import { User } from "@prisma/client";
import { TUserWithRole } from "../../../infrastructure/types/users.type";

@Injectable()
export class GetUserByRoleUseCase {
	constructor(
		@Inject("UserRepository")
		private readonly userRepository: UsersRepositoryPort,
	) {}

	async execute(role: string): Promise<User[]> {
		return await this.userRepository.getUsersByRole(role);
	}
}
