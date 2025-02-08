import { User } from "@prisma/client";

export type TUserWithRole = User & { userRoles: number[] }
