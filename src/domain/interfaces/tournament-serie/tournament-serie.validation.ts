import { IsNotEmpty, IsString, IsUrl, isURL, IsUUID } from "class-validator";

export class ModifyTournamentSerie {
	@IsNotEmpty()
	@IsUUID()
	id: string;
	@IsString()
	@IsNotEmpty()
	tournamentSerieName: string;
	@IsNotEmpty()
	@IsUrl()
	serieBackgroundImageURL: string;
}