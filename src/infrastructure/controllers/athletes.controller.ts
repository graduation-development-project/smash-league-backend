import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	Req,
	UseGuards,
} from "@nestjs/common";
import { RegisterTournamentDTO } from "../dto/athletes/register-tournament.dto";
import { RegisterTournamentUseCase } from "../../application/usecases/athletes/register-tournament.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { Tournament, TournamentParticipant } from "@prisma/client";
import { GetParticipatedTournamentsUseCase } from "../../application/usecases/athletes/get-participated-tournaments.usecase";
import { IRequestUser } from "../interfaces/interfaces";

@Controller("/athletes")
export class AthletesController {
	constructor(
		private registerTournamentUseCase: RegisterTournamentUseCase,
		private getParticipatedTournamentsUseCase: GetParticipatedTournamentsUseCase,
	) {}

	@Post("register-tournament")
	@Roles(RoleMap.Athlete.id)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
	registerTournament(
		@Body() registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentParticipant> {
		return this.registerTournamentUseCase.execute(registerTournamentDTO);
	}

	@Get("participated-tournament")
	@Roles(RoleMap.Athlete.id)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
	getParticipatedTournaments(
		@Req() { user }: IRequestUser,
		@Query("status") tournamentStatus: string,
	): Promise<Tournament[]> {
		return this.getParticipatedTournamentsUseCase.execute(
			user.id,
			tournamentStatus,
		);
	}
}
