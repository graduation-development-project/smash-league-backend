import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CourtRepositoryPort } from "../../../../domain/repositories/court.repository.port";
import { UpdateCourtDTO } from "../../../../domain/dtos/court/update-court-dto";
import { ApiResponse } from "../../../../domain/dtos/api-response";
import { Court } from "@prisma/client";

@Injectable()
export class UpdateCourtUseCase {
	constructor(
		@Inject("CourtRepository")
		private readonly courtRepository: CourtRepositoryPort,
	) {}

	async execute(
		courtId: string,
		updateCourtDTO: UpdateCourtDTO,
	): Promise<ApiResponse<Court>> {
		return new ApiResponse<Court>(
			HttpStatus.NO_CONTENT,
			"Update Court Data successfully.",
			await this.courtRepository.updateCourtInfo(courtId, updateCourtDTO),
		);
	}
}
