import { Transaction } from "@prisma/client";
import {
	ICreatePaybackTransactionRequest,
	ICreateTransactionRequest,
} from "../interfaces/payment/transaction.interface";

export interface TransactionRepositoryPort {
	getAllTransactions(): Promise<Transaction[]>;

	getTransaction(id: number): Promise<Transaction>;

	getTransactionOfOrder(orderId: string): Promise<Transaction[]>;

	createTransactionForBuyingPackage(
		createTransaction: ICreateTransactionRequest,
	): Promise<Transaction>;

	createTransactionForRegistrationFee(
		createTransaction: ICreateTransactionRequest,
	): Promise<Transaction>;

	createTransactionForReportFee(
		createTransaction: ICreateTransactionRequest,
	): Promise<Transaction>;

	acceptTransaction(transactionId: number): Promise<Transaction>;

	rejectTransaction(transactionId: number): Promise<Transaction>;

	updatePaymentForTransaction(
		transactionId: number,
		transactionImage: string,
		transactionPaymentLink: string,
	): Promise<Transaction>;

	getTransactionByUserId(userId: string): Promise<Transaction[]>;

	createPaybackTransaction(
		createPayback: ICreatePaybackTransactionRequest,
	): Promise<Transaction>;

	getAllTransactionsByDay(): Promise<Transaction[]>;

	getRevenueInCurrentMonth(organizerId: string): Promise<{
		currentRevenue: number;
		previousRevenue: number;
		changeRate: number;
	}>;
}
