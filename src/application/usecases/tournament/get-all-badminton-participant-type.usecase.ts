import { Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { KeyValueType } from "src/domain/dtos/key-value-type.type";
import { BadmintonParticipantType } from "src/domain/interfaces/tournament/badminton-participant-type.interface";

@Injectable()
export class GetAllBadmintonParticipantTypeUseCase {
	constructor() {

	}

	async execute() : Promise<ApiResponse<KeyValueType<string>[]>> {
		return await new ApiResponse<KeyValueType<string>[]>(
			200, 
			"Get all badminton participant type successfully!",
			Object.entries(BadmintonParticipantType).map(([key, value]) => ({ key, value }))
		);
	}
}