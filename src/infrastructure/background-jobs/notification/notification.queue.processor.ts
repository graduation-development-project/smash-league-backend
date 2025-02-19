import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { convertToLocalTime } from "../../util/convert-to-local-time.util";
import { PrismaService } from "../../services/prisma.service";

@Processor("notificationQueue", { concurrency: 5 })
export class NotificationQueueProcessor extends WorkerHost {
	constructor(private readonly prisma: PrismaService) {
		super();
	}

	async process(job: Job): Promise<void> {
		try {
			const { notifications } = job.data;

			console.log(
				`🔄 Processing batch of ${notifications.length} notifications...`,
			);

			await this.prisma.userNotification.createMany({
				data: notifications.map(
					({
						userId,
						notificationId,
					}: {
						userId: string;
						notificationId: string;
					}) => ({
						userId,
						notificationId,
						createdAt: new Date(),
					}),
				),
			});

			console.log(
				`✅ Successfully processed ${notifications.length} notifications.`,
			);
		} catch (error) {
			console.error(`❌ Failed to process notifications`, error);
			throw error;
		}
	}
}
