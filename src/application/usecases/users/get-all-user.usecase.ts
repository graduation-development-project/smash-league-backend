import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/repositories/users.repository.port";
import { User } from "@prisma/client";
import { TUserWithRole } from "../../../infrastructure/types/users.type";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class GetAllUserUseCase {
	constructor(
		@Inject("UserRepository")
		private readonly userRepository: UsersRepositoryPort,
	) {}

	async execute(): Promise<ApiResponse<User[]>> {
		return new ApiResponse<User[]>(
			HttpStatus.OK,
			"Get all users successfully.",
			await this.userRepository.getAllUsers(),
		);
	}
}
