import { Bank, UserBankAccount } from "@prisma/client";

export interface BankRepositoryPort {
	getAllBankList(): Promise<Bank[]>;
	getUniqueBankAccount(bankId: string, accountNumber: string, userId: string): Promise<UserBankAccount>;
	getUserBankAccounts(userId: string): Promise<UserBankAccount[]>;
}
