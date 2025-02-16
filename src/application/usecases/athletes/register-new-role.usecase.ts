import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepository } from "../../../domain/repositories/athletes.repository";
import { User } from "@prisma/client";
import { RegisterNewRoleDTO } from "../../../infrastructure/dto/athletes/register-new-role.dto";
import { TUserWithRole } from "../../../infrastructure/types/users.type";

@Injectable()
export class RegisterNewRoleUseCase {
	constructor(
		@Inject("AthleteRepository") private athletesRepository: AthletesRepository,
	) {}

	execute(
		userID: string,
		registerNewRoleDTO: RegisterNewRoleDTO,
	): Promise<TUserWithRole> {
		return this.athletesRepository.registerNewRole(userID, registerNewRoleDTO);
	}
}
