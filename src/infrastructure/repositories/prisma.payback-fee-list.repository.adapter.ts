import { Injectable } from "@nestjs/common";

import { PaybackFeeListRepositoryPort } from "../../domain/repositories/payback-fee-list.repository.port";
import { PrismaService } from "../services/prisma.service";
import { CreatePaybackFeeListDTO } from "../../domain/dtos/payback-list/create-payback-fee-list.dto";
import { PaybackFeeList } from "@prisma/client";

@Injectable()
export class PrismaPaybackFeeListRepositoryAdapter
	implements PaybackFeeListRepositoryPort
{
	constructor(private prismaService: PrismaService) {}

	async createManyPaybackFee(
		createPaybackFeeListDTO: CreatePaybackFeeListDTO[],
	): Promise<PaybackFeeList[]> {
		try {
			return this.prismaService.paybackFeeList.createManyAndReturn({
				data: createPaybackFeeListDTO,
				skipDuplicates: true,
			});
		} catch (e) {
			console.error("Create many payback fee failed");
			throw e;
		}
	}

	async updatePaybackStatus(
		paybackId: string,
		status: boolean,
	): Promise<PaybackFeeList> {
		try {
			return this.prismaService.paybackFeeList.update({
				where: { id: paybackId },
				data: {
					isPaid: status,
				},
			});
		} catch (e) {
			console.error("update payback fee status failed");
			throw e;
		}
	}

	async getById(paybackId: string): Promise<PaybackFeeList> {
		try {
			return this.prismaService.paybackFeeList.findUnique({
				where: { id: paybackId },
				include: {
					tournamentEvent: true,
					tournament: true,
				},
			});
		} catch (e) {
			console.error("Get payback fee failed");
			throw e;
		}
	}

	async getPaybackFeeList(): Promise<PaybackFeeList[]> {
		try {
			return this.prismaService.paybackFeeList.findMany({
				include: {
					tournamentEvent: true,
					tournament: true,
					user: {
						include: {
							UserBankAccount: true,
						},
					},
				},
			});
		} catch (e) {
			console.error("Get payback  list failed");
			throw e;
		}
	}
}
