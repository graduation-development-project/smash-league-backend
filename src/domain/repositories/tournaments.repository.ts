import { Tournament } from "@prisma/client";
import {
	IPaginatedOutput,
	IPaginateOptions,
} from "../../infrastructure/interfaces/interfaces";

export interface TournamentsRepositoryPort {
	searchTournaments(
		searchTerm: string,
		options: IPaginateOptions,
	): Promise<IPaginatedOutput<Tournament>>;
}
