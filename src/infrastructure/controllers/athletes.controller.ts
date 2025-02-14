import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { RegisterTournamentDTO } from "../dto/athletes/register-tournament.dto";
import { RegisterTournamentUseCase } from "../../application/usecases/athletes/register-tournament.usecase";
import { JwtAccessTokenGuard } from "../guards/auth/jwt-access-token.guard";
import { RolesGuard } from "../guards/auth/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleMap } from "../enums/role.enum";
import { TournamentParticipant } from "@prisma/client";

@Controller("/athletes")
export class AthletesController {
	constructor(private registerTournamentUseCase: RegisterTournamentUseCase) {}

	@Post("register-tournament")
	@Roles(RoleMap.Athlete.id)
	@UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
	registerTournament(
		@Body() registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentParticipant> {
		return this.registerTournamentUseCase.execute(registerTournamentDTO);
	}
}
