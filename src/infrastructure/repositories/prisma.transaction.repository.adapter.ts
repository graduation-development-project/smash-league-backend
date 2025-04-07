import { Injectable } from "@nestjs/common";
import {
	PrismaClient,
	Transaction,
	TransactionStatus,
	TransactionType,
} from "@prisma/client";
import { create } from "domain";
import {
	ICreatePaybackTransactionRequest,
	ICreateTransactionRequest,
} from "src/domain/interfaces/payment/transaction.interface";
import { TransactionRepositoryPort } from "src/domain/repositories/transaction.repository.port";

@Injectable()
export class PrismaTransactionRepositoryAdapter
	implements TransactionRepositoryPort
{
	constructor(private readonly prisma: PrismaClient) {}

	async updatePaymentForTransaction(
		transactionId: number,
		transactionImage: string,
		transactionPaymentLink: string,
	): Promise<Transaction> {
		return await this.prisma.transaction.update({
			where: {
				id: transactionId,
			},
			data: {
				transactionImage: transactionImage,
				transactionPaymentLink: transactionPaymentLink,
			},
		});
	}

	async acceptTransaction(transactionId: number): Promise<Transaction> {
		return await this.prisma.transaction.update({
			where: {
				id: transactionId,
			},
			data: {
				status: TransactionStatus.SUCCESSFUL,
			},
		});
	}

	async rejectTransaction(transactionId: number): Promise<Transaction> {
		return await this.prisma.transaction.update({
			where: {
				id: transactionId,
			},
			data: {
				status: TransactionStatus.FAILED,
			},
		});
	}

	async getTransaction(id: number): Promise<Transaction> {
		return await this.prisma.transaction.findUnique({
			where: {
				id: id,
			},
		});
	}

	async getTransactionOfOrder(orderId: string): Promise<Transaction[]> {
		return await this.prisma.transaction.findMany({
			where: {
				orderId: {
					equals: orderId,
				},
			},
		});
	}

	async createTransactionForBuyingPackage(
		createTransaction: ICreateTransactionRequest,
	): Promise<Transaction> {
		return await this.prisma.transaction.create({
			data: {
				...createTransaction,
				transactionType: TransactionType.BUYING_PAKCKAGE,
				status: TransactionStatus.PENDING,
			},
		});
	}

	async createTransactionForRegistrationFee(
		createTransaction: ICreateTransactionRequest,
	): Promise<Transaction> {
		return await this.prisma.transaction.create({
			data: {
				...createTransaction,
				transactionType: TransactionType.PAY_REGISTRATION_FEE,
				status: TransactionStatus.PENDING,
			},
		});
	}

	async getTransactionByUserId(userId: string): Promise<Transaction[]> {
		try {
			return await this.prisma.transaction.findMany({
				where: {
					order: {
						userId: userId,
					},
				},
				include: {
					order: {
						include: {
							package: true,
						},
					},
				},
			});
		} catch (e) {
			console.error("Get user transaction failed");
			throw e;
		}
	}

	async createPaybackTransaction(
		createPayback: ICreatePaybackTransactionRequest,
	): Promise<Transaction> {
		const { paybackToUserId, paybackImage, transactionDetail, value } =
			createPayback;

		try {
			return await this.prisma.transaction.create({
				data: {
					paybackImage,
					paybackToUserId,
					value,
					transactionDetail,
					transactionType: TransactionType.PAYBACK_REGISTRATION_FEE,
					status: TransactionStatus.SUCCESSFUL,
				},
			});
		} catch (e) {
			console.error("Create payback transaction failed", e);
			throw e;
		}
	}
}
