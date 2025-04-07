import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePaybackTransactionDTO {
	@IsNotEmpty()
	@IsString()
	paybackToUserId: string;

	@IsNotEmpty()
	@IsString()
	transactionDetail: string;

	@IsNotEmpty()
	value: string;

	@IsOptional()
	paybackImage: Express.Multer.File[];

	@IsNotEmpty()
	@IsString()
	tournamentRegistrationId: string;
}
