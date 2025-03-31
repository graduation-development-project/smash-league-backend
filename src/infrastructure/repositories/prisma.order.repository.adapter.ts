import { Injectable } from "@nestjs/common";
import { Order, OrderStatus, PrismaClient } from "@prisma/client";
import { ICreateOrderRequest, IOrderDetailResponse } from "src/domain/interfaces/payment/order.payment.interface";
import { OrderRepositoryPort } from "src/domain/interfaces/repositories/order.repository.port";

@Injectable()
export class PrismaOrderRepositoryAdapter implements OrderRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	) {
	}
	async cancelOrder(orderId: number): Promise<Order> {
		return await this.prisma.order.update({
			where: {
				id: orderId
			},
			data: {
				orderStatus: OrderStatus.FAILED
			}
		});
	}
	async acceptOrder(orderId: number): Promise<Order> {
		return await this.prisma.order.update({
			where: {
				id: orderId
			},
			data: {
				orderStatus: OrderStatus.PAID
			}
		});
	}
	async createOrder(createOrderRequest: ICreateOrderRequest): Promise<IOrderDetailResponse> {
		return await this.prisma.order.create({
			data: {
				...createOrderRequest,
				orderStatus: OrderStatus.PENDING
			},
			select: {
				id: true,
				total: true,
				orderStatus: true,
				package: {
					select: {
						id: true,
						credits: true,
						packageDetail: true,
						packageName: true,
						price: true,
						currentDiscountByAmount: true
					}
				}, 
				user: {
					select: {
						id: true,
						name: true,
						phoneNumber: true,
						email: true
					}
				}
			}
		});
	}
	async getOrder(orderId: number): Promise<IOrderDetailResponse> {
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