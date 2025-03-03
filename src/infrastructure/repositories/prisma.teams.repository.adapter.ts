import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { TeamRepositoryPort } from "../../domain/repositories/team.repository.port";
import { User, UserTeam } from "@prisma/client";

@Injectable()
export class PrismaTeamsRepositoryAdapter implements TeamRepositoryPort {
	constructor(private prismaService: PrismaService) {}

	async getTeamMember(teamId: string, user: User): Promise<User[]> {
		try {
			const userInTeam: UserTeam = await this.prismaService.userTeam.findUnique(
				{
					where: {
						userId_teamId: {
							userId: user.id,
							teamId,
						},
					},
				},
			);

			if (!userInTeam) {
				throw new BadRequestException("You are not a member of this teams!");
			}

			const memberList: { user: User }[] =
				await this.prismaService.userTeam.findMany({
					where: {
						teamId,
					},
					select: {
						user: true,
					},
				});

			return memberList.map((user: { user: User }) => user.user);
		} catch (e) {
			console.error("Get Team member failed", e);
			throw e;
		}
	}
}
