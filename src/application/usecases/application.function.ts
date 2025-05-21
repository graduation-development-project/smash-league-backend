import { Inject } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { BankRepositoryPort } from "src/domain/repositories/bank.repository.port";

export class ApplicationFunction {
	constructor(
		@Inject("BankRepositoryPort")
		private readonly bankRepository: BankRepositoryPort
	) {
	}
	getApiVersion() {
		return '1.0.0';
	}
}