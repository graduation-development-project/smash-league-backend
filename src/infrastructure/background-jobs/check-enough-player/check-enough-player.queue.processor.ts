import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { PrismaService } from "../../services/prisma.service";
import { TournamentEvent, TournamentEventStatus } from "@prisma/client";

@Processor("checkEnoughPlayerQueue", { concurrency: 3 })
export class CheckEnoughPlayerQueueProcessor extends WorkerHost {
	constructor(private readonly prisma: PrismaService) {
		super();
	}

	async process(job: Job): Promise<void> {
		const { tournamentId } = job.data;

		console.log("run checkEnoughPlayerQueue");

		const tournament = await this.prisma.tournament.findUnique({
			where: { id: tournamentId },
			include: {
				tournamentEvents: {
					include: {
						tournamentParticipants: true,
						tournament: true,
					},
				},
			},
		});

		for (const event of tournament.tournamentEvents) {
			if (event.tournamentParticipants.length < event.minimumAthlete) {
				await this.prisma.tournamentEvent.update({
					where: { id: event.id },
					data: { tournamentEventStatus: TournamentEventStatus.CANCELED },
				});

				const paybackRecords = event.tournamentParticipants.map(
					(participant) => ({
						userId: participant.userId,
						tournamentId: tournament.id,
						tournamentEventId: event.id,
						value: this.getRegistrationFee(event),
						isPaid: false,
					}),
				);

				if (paybackRecords.length > 0) {
					await this.prisma.paybackFeeList.createMany({
						data: paybackRecords,
						skipDuplicates: true,
					});
				}

				console.log("end checkEnoughPlayerQueue");

			}
		}
	}

	private getRegistrationFee(event: any): number {
		const isDouble = event.tournamentEvent.toUpperCase().includes("DOUBLE");
		return isDouble
			? event.tournament.registrationFeePerPair
			: event.tournament.registrationFeePerPerson;
	}
}
