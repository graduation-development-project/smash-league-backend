import {IsBoolean, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class ResponseToTeamInvitationDTO {
	@IsString()
	@IsNotEmpty()
	invitationId: string;

	@IsOptional()
	invitedUserId: string;

	@IsBoolean()
	@IsNotEmpty()
	option: boolean;
}
