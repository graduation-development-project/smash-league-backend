import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { PrismaService } from "../../services/prisma.service";

@Processor("notificationQueue", { concurrency: 3 })
export class NotificationQueueProcessor extends WorkerHost {
	private batchSize = 10;
	private jobBuffer: { userId: string; notificationId: string }[] = [];
	private timeout: NodeJS.Timeout | null = null;

	constructor(private readonly prisma: PrismaService) {
		super();
	}

	async process(job: Job): Promise<void> {
		try {
			this.jobBuffer.push({
				userId: job.data.userId,
				notificationId: job.data.notificationId,
			});
			console.log(`Current job buffer size: ${this.jobBuffer.length}`);

			if (this.jobBuffer.length >= this.batchSize) {
				await this.flushBuffer();
				return;
			}

			if (!this.timeout) {
				this.timeout = setTimeout(async () => {
					if (this.jobBuffer.length > 0) {
						await this.flushBuffer();
					}
				}, 5000);
			}
		} catch (error) {
			console.error(`❌ Failed to process notifications`, error);
			throw error;
		}
	}

	private async flushBuffer() {
		if (this.jobBuffer.length === 0) return;

		const batch = this.jobBuffer.splice(0, this.batchSize);

		try {
			if (batch.length === 1) {
				const { userId, notificationId } = batch[0];
				await this.prisma.userNotification.create({
					data: { userId, notificationId, createdAt: new Date() },
				});
				console.log(`✅ Notification sent to user ${userId}`);
			} else {
				await this.prisma.userNotification.createMany({
					data: batch.map(({ userId, notificationId }) => ({
						userId,
						notificationId,
						createdAt: new Date(),
					})),
				});
				console.log(`✅ Processed ${batch.length} notifications.`);
			}
		} catch (error) {
			console.error(`❌ Failed to process notifications`, error);
			throw error;
		} finally {
			this.timeout = null;
		}
	}
}
