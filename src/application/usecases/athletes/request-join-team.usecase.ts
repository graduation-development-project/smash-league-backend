import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/interfaces/repositories/athletes.repository.port";
import {RequestJoinTeamDTO} from "../../../domain/dtos/athletes/request-join-team.dto";

@Injectable()
export class RequestJoinTeamUseCase {
	constructor(
		@Inject("AthleteRepository")
		private athletesRepository: AthletesRepositoryPort,
	) {}

	execute(requestJoinTeamDTO: RequestJoinTeamDTO): Promise<string> {
		return this.athletesRepository.requestJoinTeam(requestJoinTeamDTO);
	}
}
