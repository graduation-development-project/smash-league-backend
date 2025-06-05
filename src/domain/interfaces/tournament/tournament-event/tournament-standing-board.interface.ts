import { Gender, User } from "@prisma/client";

export interface ITournamentPrizesWithWinner {
	prizes: ITournamentStandingBoardInterface;
	otherPrizes: ITournamentOtherPrizeWinner[];
}

export interface ITournamentStandingBoardInterface {
	championship: {
		user: ITournamentStandingBoardUserInterface;
		partner: ITournamentStandingBoardUserInterface;
	};
	runnerUp: {
		user: ITournamentStandingBoardUserInterface;
		partner: ITournamentStandingBoardUserInterface;
	};
	thirdPlace: {
		user: ITournamentStandingBoardUserInterface;
		partner: ITournamentStandingBoardUserInterface;
	}[];
}

interface ITournamentStandingBoardUserInterface {
	id: string;
	name: string;
	gender: Gender;
	dateOfBirth: Date;
	height: number;
	avatarURL: string;
}

export interface ITournamentOtherPrizeWinner {
	prizeName: string;
	winner: {
		user: ITournamentStandingBoardUserInterface;
		partner: ITournamentStandingBoardUserInterface;
	};
}
