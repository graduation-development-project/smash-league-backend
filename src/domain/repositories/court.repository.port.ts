import { Court, Match } from "@prisma/client";
import { ICreateCourts } from "../interfaces/tournament/tournament.interface";

export interface CourtRepositoryPort {
	getCourtAvailable(tournamentId: string): Promise<Court[]>;
	createMultipleCourts(tournamentId: string, numberOfCourt: number): Promise<Court[]>;
	getMatchesOfCourt(courtId: string): Promise<Match[]>;
	getCourtDetail(courtId: string): Promise<Court>;
	createMultipleCourtsWithCourtCode(tournamentId: string, courts: ICreateCourts): Promise<Court[]>;
	updateCourtAvailability(courtId: string, isAvailable: boolean): Promise<Court>;
}