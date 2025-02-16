import { RegisterTournamentDTO } from "../../infrastructure/dto/athletes/register-tournament.dto";
import { Tournament, TournamentParticipant, User } from "@prisma/client";
import { RegisterNewRoleDTO } from "../../infrastructure/dto/athletes/register-new-role.dto";
import { TUserWithRole } from "../../infrastructure/types/users.type";
import {TCloudinaryResponse} from "../../infrastructure/types/cloudinary.type";

export interface AthletesRepository {
	registerTournament(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<TournamentParticipant>;

	getParticipatedTournaments(
		userID: string,
		tournamentStatus: string,
	): Promise<Tournament[]>;

	uploadVerificationImage(files: Express.Multer.File[], userID: string): Promise<TCloudinaryResponse[]>;

	registerNewRole(
		userID: string,
		registerNewRoleDTO: RegisterNewRoleDTO,
	): Promise<TUserWithRole>;
}
