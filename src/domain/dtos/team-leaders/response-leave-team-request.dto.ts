import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "@prisma/client";

export class ResponseLeaveTeamRequestDTO {
	@IsString()
	@IsNotEmpty()
	requestId: string;

	@IsString()
	@IsNotEmpty()
	teamId: string;

	@IsString()
	@IsOptional()
	rejectReason?: string;

	@IsBoolean()
	@IsNotEmpty()
	option: boolean;

	@IsOptional()
	user: User;
}
