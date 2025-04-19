import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SponsorTier } from "@prisma/client";

export class CreateTournamentSponsorRequestDTO {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	logo: string;

	@IsOptional()
	website: string;

	@IsOptional()
	description: string;

	@IsNotEmpty()
	tier: SponsorTier;
}
