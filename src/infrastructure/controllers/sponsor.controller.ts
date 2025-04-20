import { Controller, Get } from "@nestjs/common";
import { GetAllSponsorUseCase } from "../../application/usecases/tournament/sponsor/get-all-sponsor.usecase";
import { ApiResponse } from "../../domain/dtos/api-response";
import { Sponsor } from "@prisma/client";

@Controller("/sponsors")
export class SponsorController {
	constructor(private getAllSponsorUseCase: GetAllSponsorUseCase) {}

	@Get("/")
	async getAllSponsors(): Promise<ApiResponse<Sponsor[]>> {
		return this.getAllSponsorUseCase.execute();
	}
}
