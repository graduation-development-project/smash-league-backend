// import { Inject, Injectable } from "@nestjs/common";
// import { TeamRepositoryPort } from "../../../domain/repositories/team.repository.port";
// import {
// 	IPaginatedOutput,
// 	IPaginateOptions,
// } from "../../../domain/interfaces/interfaces";
// import { Team } from "@prisma/client";
//
// @Injectable()
// export class GetTeamListUseCase {
// 	constructor(
// 		@Inject("TeamRepository") private teamRepository: TeamRepositoryPort,
// 	) {}
//
// 	execute(options: IPaginateOptions): Promise<IPaginatedOutput<Team>> {
// 		return this.teamRepository.getTeamList(options);
// 	}
// }
