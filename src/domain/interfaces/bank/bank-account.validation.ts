import { IsNotEmpty, IsString } from "class-validator";

export class BankAccountCheckRequest {
	@IsString()
	@IsNotEmpty()
	account: string;
	@IsString()
	@IsNotEmpty()
	bank: string;
}