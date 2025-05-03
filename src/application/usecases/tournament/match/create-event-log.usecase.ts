import { ApiResponse } from "src/domain/dtos/api-response";
import { CreateLogEventDto } from "src/domain/dtos/match/create-log-event.dto";

export class CreateEventLogUseCase {
	constructor(
		private readonly matchLogRepository: any
	) {
	}

	async execute(createLogEvent: CreateLogEventDto): Promise<ApiResponse<any>> {
		return;
	}
}