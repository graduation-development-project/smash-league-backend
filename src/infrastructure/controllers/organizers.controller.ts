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
import {
	Match,
	Notification,
	Tournament,
	TournamentRegistration,
} from "@prisma/client";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { ResponseTournamentRegistrationUseCase } from "../../application/usecases/organizers/response-tournament-registration.usecase";
import { ApiResponse } from "../../domain/dtos/api-response";
import { ResponseTournamentRegistrationDTO } from "../../domain/dtos/organizers/response-tournament-registration.dto";
import { GetTournamentRegistrationByTournamentIdUseCase } from "../../application/usecases/organizers/get-tournament-registration-by-tournament-id.usecase";
import {
	ITournamentDetailResponse,
	ITournamentParticipantsResponse,
	ITournamentRegistrationResponse,
} from "../../domain/interfaces/tournament/tournament.interface";
import { GetTournamentParticipantsByTournamentIdUseCase } from "../../application/usecases/organizers/get-tournament-participants-by-tournament-id.usecase";
import { AssignUmpireUseCase } from "../../application/usecases/organizers/assign-umpire.usecase";
import { AssignUmpireDTO } from "../../domain/dtos/organizers/assign-umpire.dto";
import { GetOwnedTournamentUseCase } from "../../application/usecases/organizers/get-owned-tournament.usecase";

@Controller("/organizers")
@UseGuards(JwtAccessTokenGuard, RolesGuard)
@Roles(RoleMap.Organizer.name)
export class OrganizerController {
	constructor(
		private responseTournamentRegistrationUseCase: ResponseTournamentRegistrationUseCase,
		private getTournamentRegistrationByTournamentIdUseCase: GetTournamentRegistrationByTournamentIdUseCase,
		private getTournamentParticipantsByTournamentIdUseCase: GetTournamentParticipantsByTournamentIdUseCase,
		private assignUmpireUseCase: AssignUmpireUseCase,
		private getOwnedTournamentUseCase: GetOwnedTournamentUseCase,
	) {}

	@Get("/tournament-registration/:tournamentEventId")
	getTournamentRegistrationByTournamentId(
		@Param("tournamentEventId") tournamentEventId: string,
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<TournamentRegistration[]>> {
		return this.getTournamentRegistrationByTournamentIdUseCase.execute(
			tournamentEventId,
			user.id,
		);
	}

	@Get("/tournament-participants/:tournamentId")
	getTournamentParticipantsTournamentId(
		@Param("tournamentId") tournamentId: string,
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<ITournamentParticipantsResponse[]>> {
		return this.getTournamentParticipantsByTournamentIdUseCase.execute(
			tournamentId,
			user.id,
		);
	}

	@Get("/owned-tournaments")
	getOwnedTournament(
		@Req() { user }: IRequestUser,
	): Promise<ApiResponse<ITournamentDetailResponse[]>> {
		return this.getOwnedTournamentUseCase.execute(user.id);
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

	@Put("/assign-umpire")
	assignUmpire(
		@Body() assignUmpireDTO: AssignUmpireDTO,
	): Promise<ApiResponse<Match>> {
		return this.assignUmpireUseCase.execute(assignUmpireDTO);
	}
}
