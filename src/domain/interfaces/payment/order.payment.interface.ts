import { IPackageDefaultResponse } from "../package/package.interface";
import { IUserDefaultResponse } from "../user/user.interface";

export interface IOrderDetailResponse {
	id: number;
	total: number;
	user: IUserDefaultResponse;
	package: IPackageDefaultResponse;
}

export interface ICreateOrderRequest {
	packageId: string;
	userId: string;
	total: number;
}