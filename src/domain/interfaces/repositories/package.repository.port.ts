import { Injectable } from "@nestjs/common";
import { PackageEntity } from "../../entities/transaction/package.entity";
import { ICreatePackage } from "../package/package.interface";
import { Package } from "@prisma/client";

export interface PackageRepositoryPort {
	getPackages(): Promise<PackageEntity[]>;

	getPackageDetail(id: string): Promise<Package>;

	createPackage(createPackageDto: ICreatePackage): Promise<Package>;

	modifyPackage(modifyPackageDto: any): Promise<any>;

	deletePackage(id: string): Promise<any>;

	inactivatePackage(id: string) : Promise<Package>;
}