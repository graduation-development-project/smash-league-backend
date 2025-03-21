import { Transaction } from "@prisma/client";
import { ICreateTransactionRequest } from "../interfaces/payment/transaction.interface";

export interface TransactionRepositoryPort {
	getTransaction(id: string): Promise<Transaction>;
	getTransactionOfOrder(orderId: number): Promise<Transaction[]>;
	createTransactionForBuyingPackage(createTransaction: ICreateTransactionRequest): Promise<any>;
	acceptTransaction(transactionId: string): Promise<Transaction>;
	rejectTransaction(transactionId: string): Promise<Transaction>;
}