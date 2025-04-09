import { Prisma, PrismaClient, TeamStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	const teamLeader = await prisma.user.findUnique({
		where: {
			email: "hoduongtrungnguyen@gmail.com",
		}
	});
	const teamMembers = await prisma.user.findMany({
		where: {
			OR: [
				{
					email: "trandinhthientan@gmail.com"
				},
				{
					email: "tongtranlehuy@gmail.com"
				},
				{
					email: "nguyenkhanhlinh@gmail.com"
				},
				{
					email: "nguyenthaitrungkien@gmail.com"
				},
				{
					email: "nguyennhatduc@gmail.com"
				},
				{
					email: "nguyentramy@gmail.com"
				}
			]
		}
	});
	console.log(teamMembers);
	const team: Prisma.TeamCreateManyInput = {
		teamLeaderId: teamLeader.id,
		teamName: "Demo team",
		description: "Demo Team FPTU.",
		status: TeamStatus.ACTIVE,
		logo: "https://www.mbxfoundation.org/wp-content/uploads/badminton-2048x1195.jpg"
	};
	const teamCreate = await prisma.team.create({
		data: {
			...team
		}
	});
	// const teamCreate: Prisma.TeamCreateManyInput = {
	// 	teamLeader: 
	// }
	const teamMemberToAdd: Prisma.UserTeamCreateManyInput[] = [
		{
			teamId: teamCreate.id,
			userId: teamLeader.id,
			role: "LEADER"
		},
		{
			teamId: teamCreate.id,
			userId: teamMembers[0].id,
			role: "MEMBER"
		},
		{
			teamId: teamCreate.id,
			userId: teamMembers[1].id,
			role: "MEMBER"
		},
		{
			teamId: teamCreate.id,
			userId: teamMembers[2].id,
			role: "MEMBER"
		},
		{
			teamId: teamCreate.id,
			userId: teamMembers[3].id,
			role: "MEMBER"
		},
		{
			teamId: teamCreate.id,
			userId: teamMembers[4].id,
			role: "MEMBER"
		},
		{
			teamId: teamCreate.id,
			userId: teamMembers[5].id,
			role: "MEMBER"
		},
	];
	const createTeamMembers = await prisma.userTeam.createManyAndReturn({
		data: teamMemberToAdd
	});
	console.log(createTeamMembers);
}



main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
