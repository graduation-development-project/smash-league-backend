import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class PackageDto {
	
}

export class CreatePackageDto {
	@IsString()
	@IsNotEmpty()
	packageName: string;
	@IsString()
	@IsNotEmpty()
	packageDetail: string;
	@IsNumber()
	@Min(0, {
		message: "Current discount by percent must be positive value!"
	})
	currentDiscountByPercent: number;
	@IsNumber()
	@IsNotEmpty({
		message: "Price of package must not be empty."
	})
	@Min(0, {
		message: "Price of package must be positive value."
	})
	@Max(1000000)
	price: number;
	@IsNumber()
	@IsNotEmpty({
		message: "Credits of package must exist."
	})
	@Min(1, {
		message: "Credits of package must be bigger than 1."
	})
	@Max(10, {
		message: "Credits of package must be less than 10."
	})
	credits: number;
	@IsNotEmpty()
	advantages: string[];
	@IsNotEmpty()
	isRecommended: boolean;
}