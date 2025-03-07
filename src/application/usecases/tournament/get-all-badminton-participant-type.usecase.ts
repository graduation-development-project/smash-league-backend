import { Injectable } from "@nestjs/common";
import { BadmintonParticipantType } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";

@Injectable()
export class GetAllBadmintonParticipantTypeUseCase {
	constructor() {

	}

	async execute() : Promise<ApiResponse<BadmintonParticipantType[]>> {
		return await new ApiResponse<BadmintonParticipantType[]>(
			200, 
			"Get all badminton participant type successfully!",
			Object.values(BadmintonParticipantType)
		);
	}
}