import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class AddBankAccountDTO {
	@IsOptional()
	userId: string;

	@IsNotEmpty()
	bankId: string;

	@IsString()
	@IsNotEmpty()
	accountNumber: string;
}
