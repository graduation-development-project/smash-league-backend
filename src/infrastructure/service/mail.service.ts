import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendEmail(
		to: string,
		subject: string,
		template: string,
		context: any,
	): Promise<void> {
		try {
			await this.mailerService.sendMail({
				to,
				from: "Smash League",
				subject,
				template,
				context,
			});
		} catch (e) {
			throw e;
		}
	}
}
