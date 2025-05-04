import { IsBoolean, IsNumber, IsOptional, Max, Min } from "class-validator";

export class UpdateTournamentMerchandiseDTO {
	@IsOptional()
	@IsBoolean()
	hasMerchandise: boolean;

	@IsOptional()
	@IsNumber()
	@Min(0, {
		message: "Number of merchandise must be positive value!",
	})
	@Max(1000000, {
		message: "Number of merchandises must be under 1.000.000!",
	})
	numberOfMerchandise?: number;

	@IsOptional()
	merchandiseImages?: string[];
}
