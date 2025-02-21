import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// export const RoleMap: Record<string, { id: string; name: string }> = {};

export const RoleMap = {
	Admin: { id: null, name: "Admin" },
	Organizer: { id: null, name: "Organizer" },
	Athlete: { id: "123", name: "Athlete" },
	Team_Leader: { id: null, name: "Team Leader" },
	Umpire: { id: null, name: "Umpire" },
	Staff: { id: null, name: "Staff" },
};

const roleNameMapping = {
	"Team Leader": "Team_Leader",
};

export async function loadRoleMap() {
	const roles = await prisma.role.findMany();
	console.log("Roles from DB:", roles);

	roles.forEach((role) => {
		const mappedRoleName = roleNameMapping[role.roleName] || role.roleName;
		if (RoleMap[mappedRoleName]) {
			RoleMap[mappedRoleName].id = role.id;
		}
	});

	console.log("Updated RoleMap:", RoleMap);
}

export type Role = keyof typeof RoleMap;
