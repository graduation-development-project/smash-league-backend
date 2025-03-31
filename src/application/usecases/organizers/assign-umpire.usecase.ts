import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { OrganizersRepositoryPort } from "../../../domain/interfaces/repositories/organizers.repository.port";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { Match } from "@prisma/client";
import { AssignUmpireDTO } from "../../../domain/dtos/organizers/assign-umpire.dto";

@Injectable()
export class AssignUmpireUseCase {
	constructor(
		@Inject("OrganizerRepository")
		private organizerRepository: OrganizersRepositoryPort,
	) {}

	async execute(assignUmpireDTO: AssignUmpireDTO): Promise<ApiResponse<Match>> {
		return new ApiResponse(
			HttpStatus.OK,
			"Assign Umpire Successfully",
			await this.organizerRepository.assignUmpireForMatch(assignUmpireDTO),
		);
	}
}
