import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class AddBankAccountDTO {
	@IsOptional()
	userId: string;

	@IsNumber()
	@IsNotEmpty()
	bankId: number;

	@IsString()
	@IsNotEmpty()
	accountNumber: string;
}
