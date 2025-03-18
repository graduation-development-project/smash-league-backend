import {
	Body,
	Controller,
	Get,
	Param,
	Put,
	Req,
	UseGuards,
} from "@nestjs/common";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { IRequestUser } from "../../domain/interfaces/interfaces";
import { Notification, TournamentRegistration } from "@prisma/client";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { ResponseTournamentRegistrationUseCase } from "../../application/usecases/organizers/response-tournament-registration.usecase";
import { ApiResponse } from "../../domain/dtos/api-response";
import { ResponseTournamentRegistrationDTO } from "../../domain/dtos/organizers/response-tournament-registration.dto";
import { GetTournamentRegistrationByTournamentIdUseCase } from "../../application/usecases/organizers/get-tournament-registration-by-tournament-id.usecase";

@Controller("/organizers")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Organizer.name)
export class OrganizerController {
	constructor(
		private responseTournamentRegistrationUseCase: ResponseTournamentRegistrationUseCase,
		private getTournamentRegistrationByTournamentIdUseCase: GetTournamentRegistrationByTournamentIdUseCase,
	) {}

	@Get("/tournament-registration/:tournamentId")
	getTournamentRegistrationByTournamentId(
		@Param("tournamentId") tournamentId: string,
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<TournamentRegistration[]>> {
		return this.getTournamentRegistrationByTournamentIdUseCase.execute(
			tournamentId,
			user.id,
		);
	}

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
