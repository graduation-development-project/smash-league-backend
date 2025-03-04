import { Team, User } from "@prisma/client";

export interface TeamRepositoryPort {
	getTeamMemberByTeamId(teamId: string): Promise<User[]>;
	getTeamDetails(teamId: string): Promise<Team>;
	getJoinedTeam(user: User): Promise<Team[]>;
}
