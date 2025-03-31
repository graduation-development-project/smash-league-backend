import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/interfaces/repositories/users.repository.port";
import { User } from "@prisma/client";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { TUserWithRole } from "../../../infrastructure/types/users.type";

@Injectable()
export class GetUserProfileUseCase {
	constructor(
		@Inject("UserRepository") private userRepository: UsersRepositoryPort,
	) {}

	async execute(userId: string): Promise<ApiResponse<TUserWithRole>> {
		return new ApiResponse<TUserWithRole>(
			HttpStatus.OK,
			"Get User Profile Successfully",
			await this.userRepository.getUserProfile(userId),
		);
	}
}
