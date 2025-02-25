import { IsNotEmpty, IsString } from "class-validator";

export class SendInvitationDTO {
	@IsString()
	@IsNotEmpty()
	teamId: string;

	@IsString()
	@IsNotEmpty()
	invitedUserEmail: string;
}
