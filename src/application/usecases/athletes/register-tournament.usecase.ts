import {
	BadRequestException,
	HttpStatus,
	Inject,
	Injectable,
} from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/repositories/athletes.repository.port";
import { RegisterTournamentDTO } from "../../../domain/dtos/athletes/register-tournament.dto";
import {
	TournamentRegistration,
	TournamentRegistrationRole,
} from "@prisma/client";
import { ApiResponse } from "../../../domain/dtos/api-response";
import { TournamentStatus } from "../../../infrastructure/enums/tournament/tournament-status.enum";
import { calculateAgeUtil } from "../../../infrastructure/util/calculate-age.util";
import { PrismaService } from "../../../infrastructure/services/prisma.service";
import { TournamentRegistrationRepositoryPort } from "../../../domain/repositories/tournament-registration.repository.port";
import { UploadService } from "../../../infrastructure/services/upload.service";
import { TournamentEventRepositoryPort } from "../../../domain/repositories/tournament-event.repository.port";
import { TeamRepositoryPort } from "../../../domain/repositories/team.repository.port";
import { UsersRepositoryPort } from "../../../domain/repositories/users.repository.port";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";
import { BankRepositoryPort } from "../../../domain/repositories/bank.repository.port";

@Injectable()
export class RegisterTournamentUseCase {
	constructor(
		@Inject("TournamentRegistrationRepositoryPort")
		private tournamentRegistrationRepository: TournamentRegistrationRepositoryPort,
		@Inject("TournamentEventRepository")
		private tournamentEventRepository: TournamentEventRepositoryPort,
		@Inject("TeamRepository")
		private teamRepository: TeamRepositoryPort,
		@Inject("UserRepository")
		private userRepository: UsersRepositoryPort,
		@Inject("TournamentRepository")
		private tournamentRepository: TournamentRepositoryPort,
		@Inject("BankRepositoryPort")
		private bankRepository: BankRepositoryPort,
		private prisma: PrismaService,
		private uploadService: UploadService,
	) {}

	async execute(
		registerTournamentDTO: RegisterTournamentDTO,
	): Promise<ApiResponse<TournamentRegistration>> {
		const {
			tournamentId,
			partnerEmail,
			user,
			tournamentEventId,
			registrationRole,
			fromTeamId,
			files,
		} = registerTournamentDTO;

		const isUmpire = registrationRole === TournamentRegistrationRole.UMPIRE;
		const isAthlete =
			registrationRole.toUpperCase() === TournamentRegistrationRole.ATHLETE;

		const haveBankAccounts = await this.bankRepository.getUserBankAccounts(
			user.id,
		);

		if (!isUmpire && haveBankAccounts.length <= 0) {
			throw new BadRequestException(
				"Please add your bank account before register to tournament",
			);
		}



		const tournament = await this.getTournamentOrThrow(tournamentId);
		this.validateUserNotOrganizer(tournament.organizerId, user.id);
		this.validateTournamentStatus(tournament.status as TournamentStatus);

		let isDoubleEvent = false;
		let event = null;
		if (!isUmpire) {
			event = await this.getTournamentEventOrThrow(tournamentEventId);
			isDoubleEvent = event.tournamentEvent.toUpperCase().includes("DOUBLE");
		}

		await this.validateUserNotRegistered(
			user.id,
			tournamentId,
			tournamentEventId,
			registrationRole as TournamentRegistrationRole,
		);

		if (isUmpire) {
			const umpiresList =
				await this.tournamentRepository.getTournamentUmpire(tournamentId);

			if (tournament.numberOfUmpires === umpiresList.length) {
				throw new BadRequestException("This is tournament is full of umpires");
			}
		}

		if (isAthlete) {
			const checkFullParticipant =
				await this.tournamentEventRepository.getParticipantsOfTournamentEvent(
					tournamentEventId,
				);

			console.log(
				checkFullParticipant.numberOfParticipants,
				event.maximumAthlete,
			);

			if (checkFullParticipant.numberOfParticipants === event.maximumAthlete) {
				throw new BadRequestException("This is event is full participants");
			}

			await this.validateMaxEventPerPerson(
				tournamentId,
				user.id,
				tournament.maxEventPerPerson,
			);
		}

		if (fromTeamId) {
			await this.validateTeamExistence(fromTeamId);
		}

		if (!isUmpire) {
			this.validateUserAge(user.dateOfBirth, event.fromAge, event.toAge);
		}

		let partnerId: string | null = null;
		let registrationDocumentPartner: string[] = [];

		if (isDoubleEvent) {
			if (!partnerEmail)
				throw new BadRequestException("Partner is required for double matches");
			const partner = await this.getPartnerOrThrow(partnerEmail);
			await this.validateMaxEventPerPerson(
				tournamentId,
				partner.id,
				tournament.maxEventPerPerson,
			);
			await this.validateUserNotRegistered(
				partner.id,
				tournamentId,
				tournamentEventId,
				registrationRole as TournamentRegistrationRole,
			);
			partnerId = partner.id;
		}

		const folderName = `tournament-registration/${tournamentId}/${tournamentEventId || "umpire"}/${user.id}`;
		const imageUrls = await this.uploadService.uploadFiles(
			files,
			folderName,
			user.id,
		);
		const registrationDocumentCreator = this.extractFiles(
			imageUrls,
			0,
			3,
			isUmpire ? "umpire" : "creator",
		);

		if (isDoubleEvent) {
			registrationDocumentPartner = this.extractFiles(
				imageUrls,
				3,
				6,
				"partner",
			);
		}

		// return this.prisma.tournamentRegistration.create({
		// 	data: {
		// 		tournamentId,
		// 		userId: user.id,
		// 		tournamentEventId: isUmpire ? null : tournamentEventId,
		// 		partnerId: isUmpire ? null : partnerId,
		// 		registrationDocumentCreator,
		// 		registrationDocumentPartner,
		// 		registrationRole:
		// 			registrationRole.toUpperCase() as TournamentRegistrationRole,
		// 		fromTeamId: fromTeamId || null,
		// 	},
		// });

		const restored = await this.reactivateIfDeleted({
			tournamentId,
			userId: user.id,
			tournamentEventId: isUmpire ? null : tournamentEventId,
			partnerId: isUmpire ? null : partnerId,
			role: registrationRole.toUpperCase() as TournamentRegistrationRole,
			registrationDocumentCreator,
			registrationDocumentPartner,
			fromTeamId: fromTeamId || null,
		});

		const registration = restored
			? restored
			: await this.tournamentRegistrationRepository.createTournamentRegistration(
					{
						tournamentId,
						userId: user.id,
						tournamentEventId: isUmpire ? null : tournamentEventId,
						partnerId: isUmpire ? null : partnerId,
						registrationDocumentCreator,
						registrationDocumentPartner,
						registrationRole:
							registrationRole.toUpperCase() as TournamentRegistrationRole,
						fromTeamId: fromTeamId || null,
					},
				);

		return new ApiResponse<TournamentRegistration>(
			HttpStatus.CREATED,
			"Register to tournament successfully",
			registration,
		);
	}

	private async getTournamentOrThrow(tournamentId: string) {
		const tournament =
			await this.tournamentRepository.getTournament(tournamentId);
		if (!tournament) throw new BadRequestException("Tournament not found");
		return tournament;
	}

	private validateUserNotOrganizer(organizerId: string, userId: string) {
		if (organizerId === userId) {
			throw new BadRequestException(
				"You cannot participate in your own tournament",
			);
		}
	}

	private validateTournamentStatus(status: TournamentStatus) {
		if (status !== TournamentStatus.OPENING_FOR_REGISTRATION) {
			throw new BadRequestException(
				"This tournament is not open for registration",
			);
		}
	}

	private async getTournamentEventOrThrow(eventId: string) {
		const event =
			await this.tournamentEventRepository.getTournamentEventById(eventId);
		if (!event) throw new BadRequestException("Tournament event not found");
		return event;
	}

	private async validateUserNotRegistered(
		userId: string,
		tournamentId: string,
		tournamentEventId: string,
		role: TournamentRegistrationRole,
	) {
		const whereClause = {
			isDeleted: false,
			...(role === TournamentRegistrationRole.UMPIRE
				? { tournamentId: tournamentId, userId: userId }
				: {
						OR: [
							{
								userId: userId,
								tournamentId: tournamentId,
								registrationRole: TournamentRegistrationRole.UMPIRE,
							},
							{ userId: userId, tournamentEventId: tournamentEventId },
							{ partnerId: userId, tournamentEventId: tournamentEventId },
						],
					}),
		};
		const existing = await this.prisma.tournamentRegistration.findFirst({
			where: { ...whereClause, isDeleted: false },
		});

		console.log(existing);

		if (existing) {
			let message = "You are already registered for this tournament event";

			if (
				existing.registrationRole === TournamentRegistrationRole.ATHLETE &&
				role === TournamentRegistrationRole.UMPIRE
			) {
				message = "You already register tournament as athlete";
			}

			if (
				existing.registrationRole === TournamentRegistrationRole.UMPIRE &&
				role === TournamentRegistrationRole.UMPIRE
			) {
				message = "You are already registered for this tournament";
			}

			if (
				existing.registrationRole === TournamentRegistrationRole.UMPIRE &&
				role === TournamentRegistrationRole.ATHLETE
			) {
				message = "You already register tournament as umpire";
			}

			throw new BadRequestException(message);
		}
	}

	private async reactivateIfDeleted(data: {
		tournamentId: string;
		userId: string;
		tournamentEventId: string | null;
		partnerId: string | null;
		role: TournamentRegistrationRole;
		registrationDocumentCreator: string[];
		registrationDocumentPartner: string[];
		fromTeamId: string | null;
	}): Promise<TournamentRegistration | null> {
		const existing = await this.prisma.tournamentRegistration.findFirst({
			where: {
				tournamentId: data.tournamentId,
				userId: data.userId,
				tournamentEventId: data.tournamentEventId,
				partnerId: data.partnerId,
				isDeleted: true,
			},
		});

		if (existing) {
			return this.prisma.tournamentRegistration.update({
				where: { id: existing.id },
				data: {
					isDeleted: false,
					registrationDocumentCreator: data.registrationDocumentCreator,
					registrationDocumentPartner: data.registrationDocumentPartner,
					registrationRole: data.role,
					fromTeamId: data.fromTeamId,
				},
			});
		}

		return null;
	}

	private async validateMaxEventPerPerson(
		tournamentId: string,
		userId: string,
		max: number,
	) {
		const registrations = await this.prisma.tournamentParticipants.findMany({
			where: { tournamentId, OR: [{ userId }, { partnerId: userId }] },
		});
		if (registrations.length >= max) {
			throw new BadRequestException(
				`You cannot register more than ${max} events`,
			);
		}
	}

	private async validateTeamExistence(teamId: string) {
		const team = await this.teamRepository.getTeamDetails(teamId);
		if (!team) throw new BadRequestException("Your team does not exist");
	}

	private validateUserAge(dob: Date, fromAge: number, toAge: number) {
		const age = calculateAgeUtil(dob);
		if (!age || age < fromAge || age > toAge) {
			throw new BadRequestException("Your age is not suitable for this event");
		}
	}

	private extractFiles(
		files: any[],
		from: number,
		to: number,
		label: string,
	): string[] {
		const selected = files.slice(from, to).map((f) => f.secure_url);
		if (selected.length < 3) {
			throw new BadRequestException(
				`You must submit 3 verification documents for ${label}`,
			);
		}
		return selected;
	}

	private async getPartnerOrThrow(email: string) {
		const partner = await this.userRepository.getUserByEmail(email);
		if (!partner) throw new BadRequestException("Partner does not exist");
		return partner;
	}
}
