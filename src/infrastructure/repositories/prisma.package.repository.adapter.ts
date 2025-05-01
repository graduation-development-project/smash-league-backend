import { Injectable } from "@nestjs/common";
import { Package, PrismaClient, UserVerification } from "@prisma/client";
import { create } from "domain";
import { PackageEntity } from "src/domain/entities/transaction/package.entity";
import { ICreatePackage } from "src/domain/interfaces/package/package.interface";
import { UpdatePackageDTO } from "src/domain/interfaces/package/package.validation";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";

@Injectable()
export class PrismaPackageRepositoryAdapter implements PackageRepositoryPort {
	constructor(private prisma: PrismaClient) {}
	async inactivatePackage(id: string): Promise<Package> {
		return await this.prisma.package.update({
			where: {
				id: id
			},
			data: {
				isAvailable: false
			}
		});
	}

	getPackages(): Promise<PackageEntity[]> {
		return this.prisma.package.findMany();
	}
	getPackageDetail(id: string): Promise<Package> {
		return this.prisma.package.findUnique({
			where: {
				id: id
			}
		});
	}
	async createPackage(createPackageDto: ICreatePackage): Promise<Package> {
		return await this.prisma.package.create({
			data: {
				...createPackageDto,
				isAvailable: true
			}
		});
	}	
	async modifyPackage(updatePackage: UpdatePackageDTO): Promise<Package> {
		return await this.prisma.package.update({
			where: {
				id: updatePackage.id
			},
			data: {
				...updatePackage
			}
		});
	}
	deletePackage(id: string): Promise<any> {
		throw new Error("Method not implemented.");
	}

	
}
