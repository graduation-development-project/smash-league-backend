import { Injectable } from "@nestjs/common";

import { PrismaService } from "../services/prisma.service";
import { CreatePaybackFeeListDTO } from "../../domain/dtos/payback-list/create-payback-fee-list.dto";
import { PaybackFee } from "@prisma/client";
import { PaybackFeeRepositoryPort } from "src/domain/repositories/payback-fee-list.repository.port";

@Injectable()
export class PrismaPaybackFeeRepositoryAdapter
	implements PaybackFeeRepositoryPort
{
	constructor(private prismaService: PrismaService) {}

	async createManyPaybackFee(
		createPaybackFeeListDTO: CreatePaybackFeeListDTO[],
	): Promise<PaybackFee[]> {
		try {
			return this.prismaService.paybackFee.createManyAndReturn({
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
	): Promise<PaybackFee> {
		try {
			return this.prismaService.paybackFee.update({
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

	async getById(paybackId: string): Promise<PaybackFee> {
		try {
			return this.prismaService.paybackFee.findUnique({
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

	async getPaybackFeeList(): Promise<PaybackFee[]> {
		try {
			return this.prismaService.paybackFee.findMany({
				include: {
					tournamentEvent: true,
					tournament: true,
					user: {
						include: {
							UserBankAccount: {
								include: {
									bank: true,
								},
							},
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
