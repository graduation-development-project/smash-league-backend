import { Injectable } from "@nestjs/common";
import { PrismaClient, UserVerification } from "@prisma/client";
import { PackageEntity } from "src/domain/entities/transaction/package.entity";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";

@Injectable()
export class PrismaPackageRepositoryAdapter implements PackageRepositoryPort {
	constructor(private prisma: PrismaClient) {}

	getPackages(): Promise<PackageEntity[]> {
		return this.prisma.package.findMany();
	}
	getPackageDetail(id: string): Promise<any> {
		throw new Error("Method not implemented.");
	}
	createPackage(createPackageDto: any): Promise<any> {
		throw new Error("Method not implemented.");
	}
	modifyPackage(modifyPackageDto: any): Promise<any> {
		throw new Error("Method not implemented.");
	}
	deletePackage(id: string): Promise<any> {
		throw new Error("Method not implemented.");
	}

	
}
