import { Body, Controller, Get, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { IRequestUser } from "../../domain/interfaces/interfaces";
import { Notification } from "@prisma/client";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { ResponseTournamentRegistrationUseCase } from "../../application/usecases/organizers/response-tournament-registration.usecase";
import { ApiResponse } from "../../domain/dtos/api-response";
import { ResponseTournamentRegistrationDTO } from "../../domain/dtos/organizers/response-tournament-registration.dto";

@Controller("/organizers")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Organizer.name)
export class OrganizerController {
	constructor(
		private responseTournamentRegistrationUseCase: ResponseTournamentRegistrationUseCase,
	) {}

	@Put("/response-tournament-registration")
	responseTournamentRegistration(
		@Body()
		responseTournamentRegistrationDTO: ResponseTournamentRegistrationDTO,
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<null>> {
		return this.responseTournamentRegistrationUseCase.execute({
			...responseTournamentRegistrationDTO,
			userId: user.id,
		});
	}
}
