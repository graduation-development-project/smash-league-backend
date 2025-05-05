import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class UpdateTournamentRecruitmentDTO {
	@IsNumber()
	@IsOptional()
	numberOfUmpires?: number;

	@IsOptional()
	@IsBoolean()
	isRecruit: boolean;
}
