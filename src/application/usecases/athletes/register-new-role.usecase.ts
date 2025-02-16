import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepository } from "../../../domain/repositories/athletes.repository";
import { UserVerification } from "@prisma/client";
import { RegisterNewRoleDTO } from "../../../infrastructure/dto/athletes/register-new-role.dto";

@Injectable()
export class RegisterNewRoleUseCase {
	constructor(
		@Inject("AthleteRepository") private athletesRepository: AthletesRepository,
	) {}

	execute(
		userID: string,
		registerNewRoleDTO: RegisterNewRoleDTO,
	): Promise<UserVerification> {
		return this.athletesRepository.registerNewRole(userID, registerNewRoleDTO);
	}
}
