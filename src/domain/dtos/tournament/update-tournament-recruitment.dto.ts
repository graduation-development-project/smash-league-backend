import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class UpdateTournamentRecruitmentDTO {
	@IsNumber()
	@IsOptional()
	numberOfUmpireToRecruit?: number;

	@IsOptional()
	@IsBoolean()
	isRecruit: boolean;
}
