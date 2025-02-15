import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/repositories/users.repository.port";
import { User } from "@prisma/client";
import { CreateUserDTO } from "../../../infrastructure/dto/users/create-user.dto";
import { ChangePasswordDTO } from "../../../infrastructure/dto/users/change-password.dto";
import { TUserWithRole } from "../../../infrastructure/types/users.type";

@Injectable()
export class ChangePasswordUseCase {
	constructor(
		@Inject("UserRepository") private userRepository: UsersRepositoryPort,
	) {}

	async execute(
		userID: string,
		changePasswordDTO: ChangePasswordDTO,
	): Promise<TUserWithRole> {
		return this.userRepository.changePassword(userID, changePasswordDTO);
	}
}
