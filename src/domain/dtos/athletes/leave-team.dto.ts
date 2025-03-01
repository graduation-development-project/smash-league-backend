import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "@prisma/client";

export class LeaveTeamDTO {
	@IsString()
	@IsNotEmpty()
	teamId: string;

	@IsOptional()
	user?: User;

	@IsString()
	@IsNotEmpty()
	reason: string;
}
