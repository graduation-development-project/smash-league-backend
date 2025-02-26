import { Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { ParticipantType } from "src/domain/interfaces/tournament.class";

@Injectable()
export class GetAllBadmintonParticipantTypeUseCase {
	constructor() {

	}

	async execute() : Promise<ApiResponse<ParticipantType[]>> {
		return await new ApiResponse<ParticipantType[]>(
			200, 
			"Get all badminton participant type successfully!",
			Object.values(ParticipantType)
		);
	}
}