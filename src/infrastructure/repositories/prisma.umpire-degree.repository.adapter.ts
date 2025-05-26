import { Injectable } from '@nestjs/common';
import { IUpdateUmpireDegree, UmpireDegreeResponse } from './../../domain/dtos/umpire/umpire-degree.interface';
import { PrismaClient, UmpireDegree } from "@prisma/client";
import { ICreateUmpireDegree } from "src/domain/dtos/umpire/umpire-degree.interface";
import { UmpireDegreeRepositoryPort } from "src/domain/repositories/umpire-degree.repository.port";

@Injectable()
export class PrismaUmpireDegreeRepositoryAdapter implements UmpireDegreeRepositoryPort {
	constructor(
		private readonly prisma: PrismaClient
	) {
	}
	async getUmpireDegreeById(degreeId: string): Promise<UmpireDegree> {
		return await this.prisma.umpireDegree.findUnique({
			where: {
				id: degreeId
			}
		});
	}
	async deleteUmpireDegree(degreeId: string): Promise<any> {
		return await this.prisma.umpireDegree.delete({
			where: {
				id: degreeId
			}
		});
	}
	
	async updateImageForDegree(degreeId: string, degreeImages: string[]): Promise<UmpireDegree> {
		return await this.prisma.umpireDegree.update({
			where: {
				id: degreeId
			},
			data: {
				degree: degreeImages
			}
		});
	}
	async getAllDegreeOfUmpire(umpireId: string): Promise<UmpireDegreeResponse[]> {
		return await this.prisma.umpireDegree.findMany({
			where: {
				userId: umpireId
			},
			select: {
				degreeTitle: true,
				typeOfDegree: true,
				id: true,
				degree: true,
				description: true,
				user: {
					select: {
						id: true,
						name: true,
						gender: true,
						dateOfBirth: true,
						phoneNumber: true,
						email: true,
						avatarURL: true,
						isVerified: true
					}
				}
			}
		});
	}
	async createUmpireDegree(createUmpireDegree: ICreateUmpireDegree): Promise<UmpireDegree> {
		return await this.prisma.umpireDegree.create({
			data: {
				...createUmpireDegree
			}
		});
	}
	createMultipleUmpireDegree(): Promise<UmpireDegree[]> {
		throw new Error("Method not implemented.");
	}
	async updateUmpireDegree(updateUmpireDegree: IUpdateUmpireDegree): Promise<UmpireDegree> {
		return await this.prisma.umpireDegree.update({
			where: {
				id: updateUmpireDegree.id
			},
			data: {
				...updateUmpireDegree
			}
		});
	}

	

	
}