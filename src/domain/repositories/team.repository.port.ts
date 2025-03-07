import { Team, User } from "@prisma/client";
import { IPaginatedOutput, IPaginateOptions } from "../interfaces/interfaces";

export interface TeamRepositoryPort {
	getTeamMemberByTeamId(teamId: string): Promise<User[]>;

	getTeamDetails(teamId: string): Promise<Team>;

	getJoinedTeam(user: User): Promise<Team[]>;

	// getTeamList(options: IPaginateOptions): Promise<IPaginatedOutput<Team>>;

	searchTeams(
		options: IPaginateOptions,
		searchTerm?: string,
	): Promise<IPaginatedOutput<Team & { teamLeader: User }>>;
}
