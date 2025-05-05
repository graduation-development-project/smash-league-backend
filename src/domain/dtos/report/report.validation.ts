import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateReport {
	@IsString()
	@IsNotEmpty()
	tournamentId: string;
	@IsString()
	@IsNotEmpty()
	@MaxLength(1000, {
		message: "Your reason must be shorter than 1000 characters."
	})
	reason: string;
}