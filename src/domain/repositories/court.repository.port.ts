import { Court, Match } from "@prisma/client";

export interface CourtRepositoryPort {
	getCourtAvailable(tournamentId: string): Promise<Court[]>;
	createMultipleCourts(tournamentId: string, numberOfCourt: number): Promise<Court[]>;
	getMatchesOfCourt(courtId: string): Promise<Match[]>;
	getCourtDetail(courtId: string): Promise<Court>;
}