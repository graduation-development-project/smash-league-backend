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
		return this.prismaService.paybackFeeList.createManyAndReturn({
			data: createPaybackFeeListDTO,
			skipDuplicates: true
		});
	}
}
