import { Prisma, PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	let roles: Prisma.RoleCreateInput[] = [
		{
			roleName: "Admin"
		},
		{ 
			roleName: "Organizer"
		},
		{
			roleName: "Athlete"
		},
		{
			roleName: "Team Leader"
		},
		{
			roleName: "Umpire"
		}
	];
	await Promise.all(
		roles.map(async (role) => {
			prisma.role.create({
				data: role
			})
		})
	)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
