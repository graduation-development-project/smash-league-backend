import { Gender, User } from "@prisma/client";

export interface ITournamentPrizesWithWinner {
	prizes: ITournamentStandingBoardInterface;
	otherPrizes: ITournamentOtherPrizeWinner[];
}

export interface ITournamentStandingBoardInterface {
	championship?: {
		user: ITournamentStandingBoardUserInterface;
		partner: ITournamentStandingBoardUserInterface;
	};
	runnerUp?: {
		user: ITournamentStandingBoardUserInterface;
		partner: ITournamentStandingBoardUserInterface;
	} | undefined;
	thirdPlace?: {
		user: ITournamentStandingBoardUserInterface;
		partner: ITournamentStandingBoardUserInterface;
	}[];
}

export interface ITournamentStandingBoardUserInterface {
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

function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}
