import { IRequestUser } from "./../../../domain/interfaces/interfaces";
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import {
	TournamentRegistrationStatus,
	Transaction,
	TransactionStatus,
	TransactionType,
} from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { OrderRepositoryPort } from "src/domain/repositories/order.repository.port";
import { PackageRepositoryPort } from "src/domain/repositories/package.repository.port";
import { TransactionRepositoryPort } from "src/domain/repositories/transaction.repository.port";
import { UsersRepositoryPort } from "src/domain/repositories/users.repository.port";
import { TournamentRegistrationRepositoryPort } from "../../../domain/repositories/tournament-registration.repository.port";
import { TournamentParticipantsRepositoryPort } from "../../../domain/repositories/tournament-participant.repository.port";
import { TournamentRepositoryPort } from "../../../domain/repositories/tournament.repository.port";
import { TournamentEventRepositoryPort } from "../../../domain/repositories/tournament-event.repository.port";
import { NotificationsRepositoryPort } from "../../../domain/repositories/notifications.repository.port";
import { CreateNotificationDTO } from "../../../domain/dtos/notifications/create-notification.dto";

@Injectable()
export class AcceptPaymentUseCase {
	constructor(
		@Inject("PackageRepository")
		private readonly packageRepository: PackageRepositoryPort,
		@Inject("OrderRepository")
		private readonly orderRepository: OrderRepositoryPort,
		@Inject("UserRepository")
		private readonly userRepository: UsersRepositoryPort,
		@Inject("TransactionRepository")
		private readonly transactionRepository: TransactionRepositoryPort,
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort,
		@Inject("TournamentRegistrationRepositoryPort")
		private readonly tournamentRegistrationRepository: TournamentRegistrationRepositoryPort,
		@Inject("TournamentParticipantRepositoryPort")
		private readonly tournamentParticipantsRepository: TournamentParticipantsRepositoryPort,
		@Inject("NotificationRepository")
		private readonly notificationsRepository: NotificationsRepositoryPort,
	) {}

	async execute(
		user: IRequestUser,
		transactionId: number,
	): Promise<ApiResponse<Transaction>> {
		const transaction =
			await this.transactionRepository.getTransaction(transactionId);
		const updateTransaction =
			await this.transactionRepository.acceptTransaction(transactionId);

		if (transaction.status === "SUCCESSFUL")
			return new ApiResponse<null | undefined>(
				HttpStatus.BAD_REQUEST,
				"Cannot accept transaction 2 times or more!",
				null,
			);

		if (transaction.transactionType === TransactionType.BUYING_PAKCKAGE) {
			const order = await this.orderRepository.getOrder(transaction.orderId);
			const packageDetail = await this.packageRepository.getPackageDetail(
				order.package.id,
			);
			const creditRemains = await this.userRepository.addCreditForUser(
				user.user.id,
				packageDetail.credits,
			);

			const updateOrder = await this.orderRepository.acceptOrder(
				transaction.orderId,
			);

			return new ApiResponse<Transaction>(
				HttpStatus.OK,
				"Accept payment successful!",
				creditRemains,
			);
		}

		if (transaction.transactionType === TransactionType.PAY_REGISTRATION_FEE) {
			const tournamentRegistration =
				await this.tournamentRegistrationRepository.updateStatus(
					transaction.tournamentRegistrationId,
					TournamentRegistrationStatus.APPROVED,
				);

			const tournamentEvent: any =
				await this.tournamentEventRepository.getTournamentEventById(
					tournamentRegistration.tournamentEventId,
				);

			const eventParticipants =
				await this.tournamentParticipantsRepository.getEventParticipantList(
					tournamentRegistration.tournamentId,
					tournamentRegistration.tournamentEventId,
				);

			const isFull =
				tournamentEvent.maximumAthlete - 1 === eventParticipants.length;

			if (isFull) {
				const registrationList =
					await this.tournamentRegistrationRepository.getTournamentRegistrationListByEvent(
						tournamentRegistration.tournamentId,
						tournamentRegistration.tournamentEventId,
					);

				const filteredIds = registrationList
					.filter((item) => {
						return (
							item.status === TournamentRegistrationStatus.PENDING &&
							item.id !== tournamentRegistration.id
						);
					})
					.map((item) => item.id);

				const filteredUserIds = registrationList
					.filter((item) => {
						return (
							item.status === TournamentRegistrationStatus.PENDING &&
							item.id !== tournamentRegistration.id
						);
					})
					.map((item) => item.userId);

				await this.tournamentRegistrationRepository.cancelManyTournamentRegistration(
					filteredIds,
				);

				const notification: CreateNotificationDTO = {
					message: `Your registration for event ${tournamentEvent.tournamentEvent} of tournament ${tournamentEvent.tournament.name} has been cancelled because the event is full participants`,
					title: "Your registration is cancelled",
				};

				await this.notificationsRepository.createNotification(
					notification,
					filteredUserIds,
				);
			}

			await this.tournamentParticipantsRepository.addTournamentParticipant(
				tournamentRegistration.tournamentId,
				tournamentRegistration.tournamentEventId,
				tournamentRegistration.userId,
				tournamentRegistration.partnerId,
			);

			return new ApiResponse<null>(
				HttpStatus.OK,
				"Accept payment successful!",
				null,
			);
		}
	}
}
