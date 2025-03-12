import { HttpStatus, Inject } from "@nestjs/common";
import { User } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IUserResponse } from "src/domain/interfaces/user/user.interface";
import { UsersRepositoryPort } from "src/domain/repositories/users.repository.port";

export class SearchUserByEmailUseCase {
	constructor(
		@Inject("UserRepository") private readonly userRepository: UsersRepositoryPort
	) {}

	async execute(email: string) : Promise<ApiResponse<IUserResponse[] | null>> {
		const users = await this.userRepository.searchUserByEmail(email);
		if (users.length === 0) return new ApiResponse<null | undefined>(
			HttpStatus.NOT_FOUND,
			"No users found!",
			null
		);
		return new ApiResponse<IUserResponse[]>(
			HttpStatus.OK,
			"Search users successful!",
			users
		);
	}
}