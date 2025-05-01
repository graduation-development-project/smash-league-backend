import { CreatePaybackFeeListDTO } from "../dtos/payback-list/create-payback-fee-list.dto";
import { PaybackFee } from "@prisma/client";

export interface PaybackFeeRepositoryPort {
	createManyPaybackFee(createPaybackFeeListDTO: CreatePaybackFeeListDTO[]): Promise<PaybackFee[]>;
	updatePaybackStatus(paybackId: string, status: boolean): Promise<PaybackFee>;
	getById(paybackId: string): Promise<PaybackFee>;
	getPaybackFeeList(): Promise<PaybackFee[]>;
}