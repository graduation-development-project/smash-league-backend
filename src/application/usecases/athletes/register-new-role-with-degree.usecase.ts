import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/repositories/athletes.repository.port";
import { UserVerification } from "@prisma/client";
import {
	RegisterNewRoleDTO,
	RegisterNewRoleWithDegreeDTO,
} from "../../../domain/dtos/athletes/register-new-role.dto";
import { ApiResponse } from "../../../domain/dtos/api-response";

@Injectable()
export class RegisterNewRoleWithDegreeUseCase {
	constructor(
		@Inject("AthleteRepository")
		private athletesRepository: AthletesRepositoryPort,
	) {}

	async execute(
		registerNewRoleDTO: RegisterNewRoleWithDegreeDTO,
	): Promise<ApiResponse<UserVerification>> {
		return new ApiResponse<UserVerification>(
			HttpStatus.CREATED,
			"Create role registration successfully",
			await this.athletesRepository.registerNewRoleWithDegree(
				registerNewRoleDTO,
			),
		);
	}
}
