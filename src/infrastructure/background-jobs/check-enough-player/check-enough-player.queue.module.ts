import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { CheckEnoughPlayerQueueProcessor } from "./check-enough-player.queue.processor";
import { PrismaNotificationsRepositoryAdapter } from "../../repositories/prisma.notifications.repository.adapter";
import { NotificationQueueModule } from "../notification/notification.queue.module";

@Module({
	imports: [
		BullModule.registerQueue({
			name: "checkEnoughPlayerQueue",
		}),

		NotificationQueueModule,
	],
	providers: [
		CheckEnoughPlayerQueueProcessor,
		PrismaService,
		{
			provide: "NotificationRepository",
			useClass: PrismaNotificationsRepositoryAdapter,
		},
	],
	exports: [BullModule],
})
export class CheckEnoughPlayerQueueModule {}
