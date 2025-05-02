import { Queue } from "bullmq";
import { TournamentTimeJobType } from "../../enums/tournament-time-job.enum";

export async function scheduleOrUpdateTournamentJob(
	queue: Queue,
	jobType: TournamentTimeJobType,
	tournamentId: string,
	runAt: Date,
	payload: Record<string, any> = {},
) {
	const jobId = `${tournamentId}-${jobType}`;

	const existingJob = await queue.getJob(jobId);
	if (existingJob) {
		await existingJob.remove();
		console.log(`Removed old job: ${jobId}`);
	}

	const delay = runAt.getTime() - Date.now();
	console.log(new Date(), " - ", runAt);
	console.log(runAt.getTime());
	console.log(Date.now());
	console.log(delay);
	if (delay <= 0) {
		console.warn(`Job ${jobId} is in the past. Skipping scheduling.`);
		return;
	}

	await queue.add(
		jobType,
		{ tournamentId, ...payload },
		{
			jobId,
			delay,
		},
	);

	console.log(
		`✅ Scheduled new job: ${jobId} to run at ${runAt.toISOString()}`,
	);
}

export async function cancelScheduledTournamentJob(
	queue: Queue,
	jobType: TournamentTimeJobType,
	tournamentId: string,
) {
	const jobId = `${tournamentId}-${jobType}`;
	const existingJob = await queue.getJob(jobId);
	if (existingJob) {
		await existingJob.remove();
		console.log(`❌ Canceled job: ${jobId}`);
	}
}
