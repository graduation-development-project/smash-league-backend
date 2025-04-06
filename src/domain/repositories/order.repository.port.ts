import { Injectable } from "@nestjs/common";
import { Order } from "@prisma/client";
import { ICreateOrderRequest, IOrderDetailResponse } from "../interfaces/payment/order.payment.interface";

export interface OrderRepositoryPort {
	createOrder(createOrderRequest: ICreateOrderRequest): Promise<IOrderDetailResponse>;
	getOrder(orderId: string): Promise<IOrderDetailResponse>;
	getOrdersOfUser(userId: string): Promise<IOrderDetailResponse[]>;
	acceptOrder(orderId: string): Promise<Order>;
	cancelOrder(orderId: string): Promise<Order>;
}