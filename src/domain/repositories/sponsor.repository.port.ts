import { CreateSponsorDTO } from "../dtos/sponsor/create-sponsor.dto";
import { Sponsor } from "@prisma/client";

export interface SponsorRepositoryPort {
	createNewSponsors(createSponsorDTO: CreateSponsorDTO[]): Promise<Sponsor[]>;
	findSponsorByNames(names: string[]): Promise<Sponsor[]>;
}
