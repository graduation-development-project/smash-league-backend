import { Injectable } from "@nestjs/common";
import { PackageEntity } from "../entities/transaction/package.entity";

export interface PackageRepositoryPort {
	getPackages(): Promise<PackageEntity[]>;

	getPackageDetail(id: string): Promise<PackageEntity>;

	createPackage(createPackageDto: any): Promise<any>;

	modifyPackage(modifyPackageDto: any): Promise<any>;

	deletePackage(id: string): Promise<any>;
}