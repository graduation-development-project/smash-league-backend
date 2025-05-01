import { Injectable } from "@nestjs/common";
import { PackageEntity } from "../entities/transaction/package.entity";
import { ICreatePackage } from "../interfaces/package/package.interface";
import { Package } from "@prisma/client";
import { UpdatePackageDTO } from "../interfaces/package/package.validation";

export interface PackageRepositoryPort {
	getPackages(): Promise<PackageEntity[]>;

	getPackageDetail(id: string): Promise<Package>;

	createPackage(createPackageDto: ICreatePackage): Promise<Package>;

	modifyPackage(updatePackage: UpdatePackageDTO): Promise<any>;

	deletePackage(id: string): Promise<any>;

	inactivatePackage(id: string) : Promise<Package>;
}