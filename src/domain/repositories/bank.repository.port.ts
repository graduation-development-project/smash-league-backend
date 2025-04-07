import { Bank, UserBankAccount } from "@prisma/client";

export interface BankRepositoryPort {
	getAllBankList(): Promise<Bank[]>;

	getUniqueBankAccount(bankId: number, accountNumber: string, userId: string): Promise<UserBankAccount>;
}
