import { LogType } from "@prisma/client";

export interface ICreateLogEvent {
	log: string;
	logType: LogType;
	time: Date;
	gameId: string;
}