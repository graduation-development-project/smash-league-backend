import { RegisterTournamentDTO } from "../dtos/athletes/register-tournament.dto";
import {
	Tournament,
	TournamentParticipant,
	User,
	UserVerification,
} from "@prisma/client";
import { RegisterNewRoleDTO } from "../dtos/athletes/register-new-role.dto";
import { TUserWithRole } from "../../infrastructure/types/users.type";
import { TCloudinaryResponse } from "../../infrastructure/types/cloudinary.type";

export interface StaffsRepositoryPort {
	verifyUserInformation(
		verificationID: string,
		option: boolean,
	): Promise<string>;
}
