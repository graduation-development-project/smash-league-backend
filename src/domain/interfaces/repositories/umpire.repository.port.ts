import { UserVerification } from "@prisma/client";
import { UmpireUpdateMatchDTO } from "../../dtos/umpire/umpire-update-match.dto";

export interface UmpireRepositoryPort {
	umpireUpdateMatch(updateMatchDTO: UmpireUpdateMatchDTO): Promise<string>;
}
