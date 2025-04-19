import { Injectable } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
import { SponsorRepositoryPort } from "../../domain/repositories/sponsor.repository.port";
import { CreateSponsorDTO } from "../../domain/dtos/sponsor/create-sponsor.dto";
import { Sponsor } from "@prisma/client";

@Injectable()
export class PrismaSponsorsRepositoryAdapter implements SponsorRepositoryPort {
	constructor(private prismaService: PrismaService) {}

	async createNewSponsors(
		createSponsorDTO: CreateSponsorDTO[],
	): Promise<Sponsor[]> {
		try {
			return this.prismaService.sponsor.createManyAndReturn({
				data: createSponsorDTO,
			});
		} catch (e) {
			console.error("createNewSponsors failed");
			throw e;
		}
	}

	async findSponsorByNames(names: string[]): Promise<Sponsor[]> {
		try {
			return this.prismaService.sponsor.findMany({
				where: {
					name: { in: names },
				},
			});
		} catch (e) {
			console.error("Find sponsor by name failed");
			throw e;
		}
	}
}
