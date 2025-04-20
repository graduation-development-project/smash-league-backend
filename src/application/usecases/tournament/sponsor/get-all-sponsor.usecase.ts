import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "../../../../domain/dtos/api-response";
import { Sponsor } from "@prisma/client";
import { SponsorRepositoryPort } from "../../../../domain/repositories/sponsor.repository.port";

@Injectable()
export class GetAllSponsorUseCase {
	constructor(
		@Inject("SponsorRepositoryPort")
		private sponsorRepository: SponsorRepositoryPort,
	) {}

	async execute(): Promise<ApiResponse<Sponsor[]>> {
		return new ApiResponse<Sponsor[]>(
			HttpStatus.OK,
			"Get All Sponsors successfully",
			await this.sponsorRepository.getAllSponsors(),
		);
	}
}
