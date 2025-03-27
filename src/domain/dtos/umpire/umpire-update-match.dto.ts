import { MatchStatus, User } from "@prisma/client";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UmpireUpdateMatchDTO {
	@IsOptional()
	@IsEnum(MatchStatus)
	matchStatus?: MatchStatus;

	@IsOptional()
	@IsBoolean()
	leftCompetitorAttendance?: boolean;

	@IsOptional()
	@IsBoolean()
	rightCompetitorAttendance?: boolean;

	@IsString()
	@IsNotEmpty()
	matchId: string;

	@IsOptional()
	user: User
}
