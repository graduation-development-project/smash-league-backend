import { Injectable } from "@nestjs/common";
import { Order } from "@prisma/client";
import { IOrderDetailResponse } from "../interfaces/payment/order.payment.interface";

export interface OrderRepositoryPort {
	createOrder(): Promise<any>;
	getOrder(orderId: string): Promise<IOrderDetailResponse>;
	getOrdersOfUser(userId: string): Promise<IOrderDetailResponse[]>;
}