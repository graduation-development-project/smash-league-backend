import { Job } from "bullmq";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import * as console from "node:console";
import { PrismaService } from "../../services/prisma.service";
import { TeamStatus } from "@prisma/client";

@Processor("teamQueue", { concurrency: 3 })
export class TeamQueueProcessor extends WorkerHost {
	constructor(private readonly prismaService: PrismaService) {
		super();
	}

	async process(job: Job): Promise<any> {
		console.log(`Processing team job: ${job.id}`);

		try {
			await this.handleRemoveTeam(job);
		} catch (error) {
			console.error(`Failed to process job ${job.id}`, error);
			throw error;
		}
	}

	async handleRemoveTeam(job: Job): Promise<void> {
		const { team } = job.data;

		try {
			await this.prismaService.$transaction(async (prisma) => {
				//* Deactivate team & remove all user associations
				await prisma.team.update({
					where: { id: team.id },
					data: { status: TeamStatus.INACTIVE },
				});

				await prisma.userTeam.deleteMany({ where: { teamId: team.id } });
			});

			console.log(`Removed team ${team.id} successfully`);
		} catch (e) {
			console.error(`Job ${job.id}: Failed to remove team ${team.id}`, e);
			throw e;
		}
	}
}
