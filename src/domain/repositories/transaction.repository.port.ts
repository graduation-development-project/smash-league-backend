import { Transaction } from "@prisma/client";
import { ICreateTransactionRequest } from "../interfaces/payment/transaction.interface";

export interface TransactionRepositoryPort {
	getTransaction(id: number): Promise<Transaction>;
	getTransactionOfOrder(orderId: string): Promise<Transaction[]>;
	createTransactionForBuyingPackage(createTransaction: ICreateTransactionRequest): Promise<Transaction>;
	createTransactionForRegistrationFee(createTransaction: ICreateTransactionRequest): Promise<Transaction>;
	acceptTransaction(transactionId: number): Promise<Transaction>;
	rejectTransaction(transactionId: number): Promise<Transaction>;
	updatePaymentForTransaction(transactionId: number, transactionImage: string, transactionPaymentLink: string): Promise<Transaction>;
	getTransactionByUserId(userId: string): Promise<Transaction[]>;
}