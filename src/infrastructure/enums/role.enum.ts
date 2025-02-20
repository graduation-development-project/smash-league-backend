// export const RoleMap = {
// 	Admin: {},
// 	Organizer: { id: 2, name: "Organizer" },
// 	Athlete: { id: 3, name: "Athlete" },
// 	Team_Leader: { id: 4, name: "Team Leader" },
// 	Umpire: { id: 5, name: "Umpire" },
// } as const;

import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();
// export const RoleMap: Record<string, { id: string; name: string }> = {};

export const RoleMap = {
  Admin: { id: null, name: 'Admin' },
  Organizer: { id: null, name: 'Organizer' },
  Athlete: { id: null, name: 'Athlete' },
  Team_Leader: { id: null, name: 'Team Leader' },
  Umpire: { id: null, name: 'Umpire' },
};

export async function loadRoleMap() {
  const roles = await prisma.role.findMany();
	console.log(roles);

  roles.forEach((role) => {
    if (RoleMap[role.roleName]) {
      RoleMap[role.roleName].id = role.id;
    }
  });
}

export type Role = keyof typeof RoleMap;