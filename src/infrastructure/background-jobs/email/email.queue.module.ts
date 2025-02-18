import { Module } from "@nestjs/common";
import { EmailQueueProcessor } from "./email.queue.processor";

import { BullModule } from "@nestjs/bullmq";
import { MailService } from "../../services/mail.service";

@Module({
	imports: [
		BullModule.registerQueue({
			name: "emailQueue",
			defaultJobOptions: {
				attempts: 3,
				backoff: {
					type: "exponential",
					delay: 5000,
				},
			},
		}),
	],
	providers: [EmailQueueProcessor, MailService],
	exports: [BullModule],
})
export class EmailQueueModule {}
