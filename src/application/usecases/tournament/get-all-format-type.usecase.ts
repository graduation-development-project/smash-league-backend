import { Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { KeyValueType } from "src/domain/dtos/key-value-type.type";
import { FormatType } from "src/domain/interfaces/tournament/tournament.interface";
@Injectable()
export class GetAllFormatTypeUseCase {
	constructor() {}

	async execute() : Promise<ApiResponse<KeyValueType<string>[]>> {
		return await new ApiResponse<KeyValueType<string>[]>(
			200,
			"Get all format types successfully!",
			Object.entries(FormatType).map(([key, value]) => ({ key, value }))
		);
	}
}