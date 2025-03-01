import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/repositories/athletes.repository.port";
import { LeaveTeamDTO } from "../../../domain/dtos/athletes/leave-team.dto";

@Injectable()
export class LeaveTeamUseCase {
	constructor(
		@Inject("AthleteRepository")
		private athletesRepository: AthletesRepositoryPort,
	) {}

	execute(leaveTeamDTO: LeaveTeamDTO) {
		return this.athletesRepository.leaveTeam(leaveTeamDTO);
	}
}
