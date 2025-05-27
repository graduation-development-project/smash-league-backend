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

	async createTransactionForReportFee(
		createTransaction: ICreateTransactionRequest,
	): Promise<Transaction> {
		return this.prisma.transaction.create({
			data: {
				...createTransaction,
				transactionType: TransactionType.PAY_REPORT_FEE,
				status: TransactionStatus.PENDING,
			},
		});
	}

	async getTransactionByUserId(userId: string): Promise<Transaction[]> {
		try {
			return await this.prisma.transaction.findMany({
				where: {
					userId,
				},
				include: {
					order: {
						include: {
							package: true,
						},
					},
					tournamentRegistration: true,
					paybackFee: true,
					paybackToUser: true,
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
		const {
			paybackToUserId,
			paybackImage,
			transactionDetail,
			value,
			paybackFeeId,
		} = createPayback;

		try {
			return await this.prisma.transaction.create({
				data: {
					userId: createPayback.userId,
					paybackImage,
					paybackToUserId,
					value,
					transactionDetail,
					transactionType: TransactionType.PAYBACK_REGISTRATION_FEE,
					status: TransactionStatus.SUCCESSFUL,
					paybackFeeId,
				},
			});
		} catch (e) {
			console.error("Create payback transaction failed", e);
			throw e;
		}
	}

	async getAllTransactionsByDay(): Promise<Transaction[]> {
		try {
			// @ts-ignore
			return this.prisma.transaction.findMany({
				where: {
					status: TransactionStatus.SUCCESSFUL,
				},
				select: {
					createdAt: true,
					value: true,
				},
			});
		} catch (e) {
			console.error("getAllTransactions by day failed", e);
			throw e;
		}
	}

	async getAllTransactions(): Promise<Transaction[]> {
		try {
			return this.prisma.transaction.findMany({
				include: {
					order: {
						include: {
							package: true,
						},
					},
					tournamentRegistration: true,
					paybackFee: true,
					paybackToUser: true,
				},
			});
		} catch (e) {
			console.error("getAllTransactions failed", e);
			throw e;
		}
	}

	async getRevenueInCurrentMonth(organizerId: string): Promise<{
		currentRevenue: number;
		previousRevenue: number;
		changeRate: number;
	}> {
		try {
			const now = new Date();

			const startOfCurrentMonth = new Date(
				now.getFullYear(),
				now.getMonth(),
				1,
			);
			const endOfCurrentMonth = new Date(
				now.getFullYear(),
				now.getMonth() + 1,
				0,
				23,
				59,
				59,
				999,
			);

			const startOfPreviousMonth = new Date(
				now.getFullYear(),
				now.getMonth() - 1,
				1,
			);
			const endOfPreviousMonth = new Date(
				now.getFullYear(),
				now.getMonth(),
				0,
				23,
				59,
				59,
				999,
			);

			const whereClause = (start: Date, end: Date) => ({
				OR: [
					{
						tournamentRegistration: {
							tournament: {
								organizerId,
							},
						},
					},
					{
						report: {
							tournament: {
								organizerId,
							},
						},
					},
				],
				status: TransactionStatus.SUCCESSFUL,
				createdAt: {
					gte: start,
					lte: end,
				},
			});

			const [currentResult, previousResult] = await Promise.all([
				this.prisma.transaction.aggregate({
					_sum: { value: true },
					where: whereClause(startOfCurrentMonth, endOfCurrentMonth),
				}),
				this.prisma.transaction.aggregate({
					_sum: { value: true },
					where: whereClause(startOfPreviousMonth, endOfPreviousMonth),
				}),
			]);

			const currentRevenue = currentResult._sum.value || 0;
			const previousRevenue = previousResult._sum.value || 0;

			let changeRate = 0;

			if (previousRevenue !== 0) {
				changeRate =
					((currentRevenue - previousRevenue) / previousRevenue) * 100;
			} else if (currentRevenue !== 0) {
				changeRate = 100;
			}

			return {
				currentRevenue,
				previousRevenue,
				changeRate: parseFloat(changeRate.toFixed(2)),
			};
		} catch (e) {
			console.error("getRevenueInCurrentMonth failed", e);
			throw e;
		}
	}
}
