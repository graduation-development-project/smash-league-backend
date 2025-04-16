import {
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	MaxLength,
	Min,
} from "class-validator";

export class CreateFeedbackDTO {
	tournamentId: string;
	accountId: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(512)
	comment: string;

	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	@Max(5)
	rating: number;
}
