import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/repositories/athletes.repository.port";
import { UserVerification } from "@prisma/client";
import { RegisterNewRoleDTO } from "../../../domain/dtos/athletes/register-new-role.dto";

@Injectable()
export class RegisterNewRoleUseCase {
	constructor(
		@Inject("AthleteRepository") private athletesRepository: AthletesRepositoryPort,
	) {}

	execute(
		userID: string,
		registerNewRoleDTO: RegisterNewRoleDTO,
	): Promise<UserVerification> {
		return this.athletesRepository.registerNewRole(userID, registerNewRoleDTO);
	}
}
