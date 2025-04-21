import { CreatePaybackFeeListDTO } from "../dtos/payback-list/create-payback-fee-list.dto";
import { PaybackFeeList } from "@prisma/client";

export interface PaybackFeeListRepositoryPort {
	createManyPaybackFee(createPaybackFeeListDTO: CreatePaybackFeeListDTO[]): Promise<PaybackFeeList[]>;
	updatePaybackStatus(paybackId: string, status: boolean): Promise<PaybackFeeList>;
	getById(paybackId: string): Promise<PaybackFeeList>;
	getPaybackFeeList(): Promise<PaybackFeeList[]>;
}