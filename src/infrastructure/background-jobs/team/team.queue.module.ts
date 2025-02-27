import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { TeamQueueProcessor } from "./team.queue.processor";
import { PrismaNotificationsRepositoryAdapter } from "../../repositories/prisma.notifications.repository.adapter";


@Module({
	imports: [
		BullModule.registerQueue({
			name: "teamQueue",
			defaultJobOptions: {
				attempts: 3,
				backoff: {
					type: "exponential",
					delay: 5000,
				},
				delay: 60 * 1000,
			},
		}),
	],
	providers: [
		TeamQueueProcessor,
		PrismaService,
	],
	exports: [BullModule],
})
export class TeamQueueModule {}
