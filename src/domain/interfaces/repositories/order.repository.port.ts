import { Injectable } from "@nestjs/common";
import { Order } from "@prisma/client";
import { ICreateOrderRequest, IOrderDetailResponse } from "../payment/order.payment.interface";

export interface OrderRepositoryPort {
	createOrder(createOrderRequest: ICreateOrderRequest): Promise<IOrderDetailResponse>;
	getOrder(orderId: number): Promise<IOrderDetailResponse>;
	getOrdersOfUser(userId: string): Promise<IOrderDetailResponse[]>;
	acceptOrder(orderId: number): Promise<Order>;
	cancelOrder(orderId: number): Promise<Order>;
}