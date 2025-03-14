import { Job } from "bullmq";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import * as console from "node:console";
import { MailService } from "../../services/mail.service";

@Processor("emailQueue", { concurrency: 20 })
export class EmailQueueProcessor extends WorkerHost {
	constructor(private readonly mailService: MailService) {
		super();
	}

	async process(job: Job): Promise<any> {
		try {
			await this.handleSendEmail(job);
		} catch (error) {
			console.error(`Failed to process job ${job.id}`, error);
			throw error;
		}
	}

	async handleSendEmail(job: Job): Promise<void> {
		console.log(`🔄 Processing email job: ${job.id}`);

		const { to, subject, template, context } = job.data;

		try {
			await this.mailService.sendEmail(to, subject, template, context);
			console.log(`Email sent successfully to ${to}`);
		} catch (error) {
			console.error(`Failed to send email to ${to}`, error);
			throw error;
		}
	}
}
