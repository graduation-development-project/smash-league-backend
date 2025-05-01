import { Injectable } from "@nestjs/common";
import { BankRepositoryPort } from "../../domain/repositories/bank.repository.port";
import { Bank, UserBankAccount } from "@prisma/client";
import { PrismaService } from "../services/prisma.service";

@Injectable()
export class PrismaBankRepositoryAdapter implements BankRepositoryPort {
	constructor(private readonly prismaService: PrismaService) {}

	async getAllBankList(): Promise<Bank[]> {
		try {
			return this.prismaService.bank.findMany({});
		} catch (e) {
			console.error("getAllBankList failed", e);
			throw e;
		}
	}

	async getUniqueBankAccount(
		bankId: string,
		accountNumber: string,
		userId: string,
	): Promise<UserBankAccount> {
		try {
			return this.prismaService.userBankAccount.findUnique({
				where: {
					userId,
					accountNumber_bankId: {
						accountNumber,
						bankId,
					},
				},
				include: {
					bank: true,
				},
			});
		} catch (e) {
			console.error("getUniqueBankAccount failed", e);
			throw e;
		}
	}

	async getUserBankAccounts(userId: string): Promise<UserBankAccount[]> {
		try {
			return await this.prismaService.userBankAccount.findMany({
				where: {
					userId,
				},
			});
		} catch (e) {
			console.error("getUserBankAccounts failed", e);
			throw e;
		}
	}
}
