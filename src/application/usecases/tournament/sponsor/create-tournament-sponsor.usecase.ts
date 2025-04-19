import {
	BadRequestException,
	HttpStatus,
	Inject,
	Injectable,
} from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/services/prisma.service";
import { SponsorRepositoryPort } from "../../../../domain/repositories/sponsor.repository.port";
import { TournamentSponsorRepositoryPort } from "../../../../domain/repositories/tournament-sponsor.repository.port";
import { CreateSponsorDTO } from "../../../../domain/dtos/sponsor/create-sponsor.dto";
import { ApiResponse } from "../../../../domain/dtos/api-response";
import { Sponsor, SponsorTier, TournamentSponsor } from "@prisma/client";
import { CreateTournamentSponsorRequestDTO } from "../../../../domain/dtos/tournament-sponsor/create-tournament-sponsor-request.dto";

@Injectable()
export class CreateTournamentSponsorUseCase {
	constructor(
		private prismaService: PrismaService,
		@Inject("SponsorRepositoryPort")
		private sponsorRepository: SponsorRepositoryPort,
		@Inject("TournamentSponsorRepositoryPort")
		private tournamentSponsorRepository: TournamentSponsorRepositoryPort,
	) {}

	async execute(
		tournamentId: string,
		userId: string,
		sponsorList: CreateTournamentSponsorRequestDTO[],
	): Promise<ApiResponse<TournamentSponsor[]>> {
		const isTournamentOrganizer =
			await this.prismaService.tournament.findUnique({
				where: {
					id: tournamentId,
					organizerId: userId,
				},
			});

		if (!isTournamentOrganizer) {
			throw new BadRequestException("You are not organizer of this tournament");
		}

		const existingSponsorsMap = new Map<string, string>(); // Map tên sponsor -> id

		const existingSponsors = await this.sponsorRepository.findSponsorByNames(
			sponsorList.map((s) => s.name),
		);

		existingSponsors.forEach((sponsor) => {
			existingSponsorsMap.set(sponsor.name, sponsor.id);
		});

		const newSponsorsToCreate = sponsorList.filter(
			(s) => !existingSponsorsMap.has(s.name),
		);

		await this.sponsorRepository.createNewSponsors(
			newSponsorsToCreate.map((s) => ({
				name: s.name,
				logo: s.logo,
				website: s.website,
				description: s.description,
			})),
		);

		const allRelevantSponsors = await this.sponsorRepository.findSponsorByNames(
			sponsorList.map((s) => s.name),
		);
		const allRelevantSponsorsMap = new Map<string, string>();
		allRelevantSponsors.forEach((sponsor) => {
			allRelevantSponsorsMap.set(sponsor.name, sponsor.id);
		});

		const existingTournamentLinks =
			await this.prismaService.tournamentSponsor.findMany({
				where: {
					tournamentId: tournamentId,
					sponsorId: {
						in: allRelevantSponsors.map((s) => s.id),
					},
				},
			});

		const existingSponsorIdsInTournament = new Set(
			existingTournamentLinks.map((link) => link.sponsorId),
		);

		const tournamentSponsorDataToCreate: {
			tournamentId: string;
			sponsorId: string;
			tier: SponsorTier;
		}[] = [];
		const duplicateSponsors: string[] = [];

		for (const s of sponsorList) {
			const sponsorId = allRelevantSponsorsMap.get(s.name)!;
			if (!existingSponsorIdsInTournament.has(sponsorId)) {
				tournamentSponsorDataToCreate.push({
					tournamentId: tournamentId,
					sponsorId: sponsorId,
					tier: s.tier,
				});
			} else {
				duplicateSponsors.push(s.name);
			}
		}

		if (duplicateSponsors.length > 0) {
			throw new BadRequestException(
				`Sponsor(s) already exist in this tournament: ${duplicateSponsors.join(
					", ",
				)}`,
			);
		}

		const createdTournamentSponsors =
			await this.tournamentSponsorRepository.createNewTournamentSponsor(
				tournamentSponsorDataToCreate,
			);

		return new ApiResponse<TournamentSponsor[]>(
			HttpStatus.CREATED,
			"Create Tournament Sponsor successfully",
			createdTournamentSponsors,
		);
	}
}
