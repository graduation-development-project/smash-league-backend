export interface ICreatePackage {
	packageName: string;
	packageDetail: string;
	currentDiscountByAmount: number;
	price: number;
	credits: number;
	advantages: string[];
	isRecommended: boolean;
}

export interface IPackageDefaultResponse {
	id: string;
	packageName: string;
	packageDetail: string;
	currentDiscountByAmount: number;
	price: number;
	credits: number;
}