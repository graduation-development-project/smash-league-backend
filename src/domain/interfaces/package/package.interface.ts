export interface ICreatePackage {
	packageName: string;
	packageDetail: string;
	currentDiscountByAmount: number;
	price: number;
	credits: number;
	advantages: string[];
	isRecommended: boolean;
}