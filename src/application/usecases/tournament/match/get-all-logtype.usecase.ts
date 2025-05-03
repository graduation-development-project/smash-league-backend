import { LogType } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { KeyValueType } from "src/domain/dtos/key-value-type.type";

export class GetAllLogTypeUseCase {
	constructor() {
	}

	async execute(): Promise<ApiResponse<KeyValueType<string>[]>> {
		return await new ApiResponse<KeyValueType<string>[]>(
			200,
			"Get all required attachment successfully!",
			Object.entries(LogType).map(([key, value]) => ({ key, value }))
		);
	}
}