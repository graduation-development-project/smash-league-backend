import { Injectable } from "@nestjs/common";
import { Package, PrismaClient, UserVerification } from "@prisma/client";
import { create } from "domain";
import { PackageEntity } from "src/domain/entities/transaction/package.entity";
import { ICreatePackage } from "src/domain/interfaces/package/package.interface";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";

@Injectable()
export class PrismaPackageRepositoryAdapter implements PackageRepositoryPort {
	constructor(private prisma: PrismaClient) {}

	getPackages(): Promise<PackageEntity[]> {
		return this.prisma.package.findMany();
	}
	getPackageDetail(id: string): Promise<any> {
		return this.prisma.package.findUnique({
			where: {
				id: id
			}
		});
	}
	async createPackage(createPackageDto: ICreatePackage): Promise<Package> {
		return await this.prisma.package.create({
			data: {
				...createPackageDto
			}
		});
	}	
	modifyPackage(modifyPackageDto: any): Promise<any> {
		throw new Error("Method not implemented.");
	}
	deletePackage(id: string): Promise<any> {
		throw new Error("Method not implemented.");
	}

	
}
