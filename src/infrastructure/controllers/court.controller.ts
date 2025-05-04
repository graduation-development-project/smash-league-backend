import { Controller, Get, Put, Param, Body } from "@nestjs/common";
import { ApiResponse } from "../../domain/dtos/api-response";
import { UpdateCourtUseCase } from "../../application/usecases/tournament/court/update-court.usecase";
import { Court } from "@prisma/client";
import { UpdateCourtDTO } from "../../domain/dtos/court/update-court-dto";

@Controller("courts")
export class CourtController {
	constructor(private readonly updateCourtUseCase: UpdateCourtUseCase) {}

	@Put("/:id")
	async getBankList(
		@Param("id") id: string,
		@Body() updateCourtDTO: UpdateCourtDTO,
	): Promise<ApiResponse<Court>> {
		return this.updateCourtUseCase.execute(id, updateCourtDTO);
	}
}
