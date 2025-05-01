import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from "class-validator";

export class UpdatePackageDTO {
	@IsString()
	@IsNotEmpty()
	id: string;
	@IsString()
	@MaxLength(100, {
		message: "Package name must be under 100 characters."
	})
	@IsNotEmpty()
	packageName: string;
	@IsString()
	@IsNotEmpty()
	packageDetail: string; 
	@IsNumber()
	currentDiscountByAmount: number;
	@IsNumber()
	@Max(1000000, {
		message: "Price for package must not over 1.000.000 VND."
	})
	@Min(0, {
		message: "Price for package must not smaller than 0VND."
	})
	price: number;
	@IsNumber()
	@Max(200, {
		message: "Credit for package must not be over 200."
	})
	@Min(1, {
		message: "Credit for package must be larger or equal to 1."
	})
	credits: number;
	advantages: string[];
	isRecommended: boolean;
}

