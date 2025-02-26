import { ApiResponse } from "src/domain/dtos/api-response";
import { FormatType } from "src/domain/interfaces/tournament.class";

export class GetAllFormatTypeUseCase {
	constructor() {}

	async execute() : Promise<ApiResponse<FormatType[]>> {
		return await new ApiResponse<FormatType[]>(
			200,
			"Get all format types successfully!",
			Object.values(FormatType)
		);
	}
}