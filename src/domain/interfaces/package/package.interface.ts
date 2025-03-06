export interface ICreatePackage {
	packageName: string;
	packageDetail: string;
	currentDiscountByPercent: number;
	price: number;
	credits: number;
	advantages: string[];
	isRecommended: boolean;
}