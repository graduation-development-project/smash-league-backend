import { LogType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateLogEventDto {
	@IsString()
	@IsNotEmpty()
	log: string;
	@IsEnum(LogType, {
			message:
				"Log type must be one of the following: " +
				"WARNING, " +
				"MEDICAL, " + 
				"FAULT, " + 
				"MISCONDUCT, " +
				"COACHING_VIOLATION, " + 
				"INTERVAL",
			each: true,
		})
	logType: LogType;
	gameId: string;
}