import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SponsorTier } from "@prisma/client";

export class CreateTournamentSponsorDTO {
	tournamentId: string;
	sponsorId: string;
	tier: SponsorTier;
}
