import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "@prisma/client";

export class ResponseTeamLeaderTransferDTO {
	@IsString()
	@IsNotEmpty()
	requestId: string;

	@IsOptional()
	user: User;

	@IsBoolean()
	@IsNotEmpty()
	option: boolean;
}
