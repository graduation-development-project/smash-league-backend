export const RoleMap = {
	Admin: { id: 1, name: "Admin" },
	Organizer: { id: 2, name: "Organizer" },
	Athlete: { id: 3, name: "Athlete" },
	Team_Leader: { id: 4, name: "Team Leader" },
	Referee: { id: 5, name: "Referee" },
} as const;

export type Role = keyof typeof RoleMap;