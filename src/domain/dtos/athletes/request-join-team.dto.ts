import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "@prisma/client";

export class RequestJoinTeamDTO {
	@IsString()
	@IsNotEmpty()
	teamId: string;

	@IsOptional()
	user: User;
}
