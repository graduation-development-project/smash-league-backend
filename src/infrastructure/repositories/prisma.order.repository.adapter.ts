import { Injectable } from "@nestjs/common";
import { Order, PrismaClient } from "@prisma/client";
import { IOrderDetailResponse } from "src/domain/interfaces/payment/order.payment.interface";
import { OrderRepositoryPort } from "src/domain/repositories/order.repository.port";

@Injectable()
export class PrismaOrderRepositoryAdapter implements OrderRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	) {
	}
	createOrder(): Promise<any> {
		throw new Error("Method not implemented.");
	}
	async getOrder(orderId: string): Promise<IOrderDetailResponse> {
		return await this.prisma.order.findUnique({
			where: {
				id: orderId
			},
			select: {
				user: {
					select: {
						id: true,
						name: true,
						phoneNumber: true,
						email: true
					}
				},
				id: true,
				total: true,
				package: {
					select: {
						id: true,
						credits: true,
						packageName: true,
						packageDetail: true,
						price: true, 
						currentDiscountByAmount: true
					}
				}
			}
		});
	}
	async getOrdersOfUser(userId: string): Promise<IOrderDetailResponse[]> {
		return await this.prisma.order.findMany({
			where: {
				userId: userId
			},
			select: {
				user: {
					select: {
						id: true,
						name: true,
						phoneNumber: true,
						email: true
					}
				},
				id: true,
				total: true,
				package: {
					select: {
						id: true,
						credits: true,
						packageName: true,
						packageDetail: true,
						price: true, 
						currentDiscountByAmount: true
					}
				}
			}
		});
	}
	
}