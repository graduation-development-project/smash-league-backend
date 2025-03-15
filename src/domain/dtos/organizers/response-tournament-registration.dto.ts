import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ResponseTournamentRegistrationDTO {
	@IsOptional()
	userId: string;

	@IsString()
	@IsNotEmpty()
	tournamentRegistrationId: string;

	@IsBoolean()
	@IsNotEmpty()
	option: boolean;

	@IsOptional()
	rejectReason?: string;
}
