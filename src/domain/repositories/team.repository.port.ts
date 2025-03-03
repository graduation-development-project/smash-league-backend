import { User } from "@prisma/client";

export interface TeamRepositoryPort {
	getTeamMember(teamId: string, user: User): Promise<User[]>;
}
