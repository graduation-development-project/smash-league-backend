import { IsNotEmpty, IsString } from "class-validator";

export class AssignUmpireDTO {
	@IsString()
	@IsNotEmpty()
	tournamentId: string;

	@IsString()
	@IsNotEmpty()
	umpireId: string;

	@IsString()
	@IsNotEmpty()
	matchId: string;
}
