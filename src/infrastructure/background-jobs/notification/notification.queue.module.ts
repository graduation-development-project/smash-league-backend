import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { NotificationQueueProcessor } from "./notification.queue.processor";
import { PrismaService } from "../../services/prisma.service";

@Module({
	imports: [
		BullModule.registerQueue({
			name: "notificationQueue",
			defaultJobOptions: {
				attempts: 3,
				backoff: {
					type: "exponential",
					delay: 5000,
				},
			},
		}),
	],
	providers: [NotificationQueueProcessor, PrismaService],
	exports: [BullModule],
})
export class NotificationQueueModule {}
