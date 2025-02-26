import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class ResponseToTeamInvitationDTO {
	@IsString()
	@IsNotEmpty()
	invitationId: string;

	@IsBoolean()
	@IsNotEmpty()
	option: boolean;
}
