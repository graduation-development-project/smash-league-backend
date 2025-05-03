import { LogType } from "@prisma/client";

export class MatchLogDetail {
	logType: LogType;
	log: string;
}

export const MatchLogDetailList: MatchLogDetail[] = [
	//Coach violation
	{
		logType: LogType.COACHING_VIOLATION,
		log: "Coach violation from team left."
	},
	{
		logType: LogType.COACHING_VIOLATION,
		log: "Coach violation from team right."
	},
	//
	{	
		logType: LogType.FAULT,
		log: "Serving fault!"
	}
]