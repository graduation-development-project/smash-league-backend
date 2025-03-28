import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersRepositoryPort } from "../../../domain/repositories/users.repository.port";
import { User } from "@prisma/client";
import { CreateUserDTO } from "../../../domain/dtos/users/create-user.dto";
import { EditUserDTO } from "../../../domain/dtos/users/edit-user.dto";
import { TUserWithRole } from "../../../infrastructure/types/users.type";

@Injectable()
export class EditUserProfileUseCase {
	constructor(
		@Inject("UserRepository") private userRepository: UsersRepositoryPort,
	) {
	}

	async execute(userID: string, editUserDTO: EditUserDTO): Promise<TUserWithRole> {
		return this.userRepository.editUserProfile(userID, editUserDTO);
	}
}
