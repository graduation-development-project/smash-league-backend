import { Injectable } from "@nestjs/common";
import { BankRepositoryPort } from "../../domain/repositories/bank.repository.port";
import { Bank } from "@prisma/client";
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
}
