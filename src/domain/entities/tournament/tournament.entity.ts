import { LargeNumberLike } from "crypto";
import { TournamentSerieEntity } from "./tournament-serie.entity";

export class TournamentEntity {
	id: string;
	name: string;
	shortName: string;
	organizerId: string;
	registrationOpeningDate: Date;
	registrationClosingDate: Date;
	drawDate: Date;
	startDate: Date;
	endDate: Date;
	registrationFeePerPerson: number;
	registrationFeePerPair: number;
	maxDisciplinePerPerson: number;
	status: string;
	protestFeePerTime: number;
	tournamentSerieId: string;
	tournamentSerie: TournamentSerieEntity;
	organizer: any;
	tournamentPosts: any;
	registrations: any;
	tournamentDisciplines: any;
}