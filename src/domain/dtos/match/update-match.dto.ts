import { IsOptional, IsString } from "class-validator";

export class UpdateMatchDTO {
	@IsString()
	@IsOptional()
	leftCompetitorId?: string;

	@IsString()
	@IsOptional()
	rightCompetitorId?: string;

	@IsString()
	@IsOptional()
	umpireId?: string;

	@IsString()
	@IsOptional()
	courtId?: string;

	@IsOptional()
	startedWhen?: Date;
}
