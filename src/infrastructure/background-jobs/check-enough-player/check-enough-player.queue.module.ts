import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { CheckEnoughPlayerQueueProcessor } from "./check-enough-player.queue.processor";

@Module({
	imports: [
		BullModule.registerQueue({
			name: "checkEnoughPlayerQueue",
		}),
	],
	providers: [CheckEnoughPlayerQueueProcessor, PrismaService],
	exports: [BullModule],
})
export class CheckEnoughPlayerQueueModule {}
