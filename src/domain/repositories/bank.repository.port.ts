import { Bank } from "@prisma/client";

export interface BankRepositoryPort {
	getAllBankList(): Promise<Bank[]>;
}
