import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateNotificationDTO {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	message: string;

	@IsString()
	@IsOptional()
	type?: string;

	@IsOptional()
	teamInvitationId?: string;

	@IsOptional()
	teamRequestId?: string;

	@IsOptional()
	tournamentRegistrationId?: string
}
