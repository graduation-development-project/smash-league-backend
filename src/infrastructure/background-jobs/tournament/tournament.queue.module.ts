import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { PrismaNotificationsRepositoryAdapter } from "../../repositories/prisma.notifications.repository.adapter";
import { NotificationQueueModule } from "../notification/notification.queue.module";
import { TournamentQueueProcessor } from "./tournament.queue.processor";
import { PrismaService } from "../../services/prisma.service";
import { PrismaTournamentRepositoryAdapter } from "../../repositories/prisma.tournament.repository.adapter";

@Module({
	imports: [
		BullModule.registerQueue({
			name: "tournamentQueue",
		}),

		NotificationQueueModule,
	],
	providers: [
		TournamentQueueProcessor,
		PrismaService,
		{
			provide: "NotificationRepository",
			useClass: PrismaNotificationsRepositoryAdapter,
		},
		{
			provide: "TournamentRepository",
			useClass: PrismaTournamentRepositoryAdapter,
		},
	],
	exports: [BullModule],
})
export class TournamentQueueModule {}
